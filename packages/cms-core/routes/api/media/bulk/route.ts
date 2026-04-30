import { NextRequest, NextResponse } from "next/server";
import { auth } from "@cms/lib/auth";
import { prisma } from "@cms/lib/prisma";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

export async function DELETE(request: NextRequest) {
  const session = await auth();

  // Only ADMINs can bulk delete media
  if (!session?.user?.id || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { ids } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No IDs provided" }, { status: 400 });
    }

    // Fetch all media records to get S3 keys
    const mediaRecords = await prisma.media.findMany({
      where: { id: { in: ids } },
      select: { id: true, url: true },
    });

    if (mediaRecords.length === 0) {
      return NextResponse.json({ error: "No media found" }, { status: 404 });
    }

    // Initialize S3 client
    const s3Client = new S3Client({
      region: process.env.S3_REGION || "auto",
      endpoint: process.env.S3_ENDPOINT,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
      },
    });

    // Delete from S3 using Promise.allSettled for partial failure handling
    const r2PublicUrl = process.env.R2_PUBLIC_URL || "";
    const s3Deletes = mediaRecords.map(async (media) => {
      const key = media.url.startsWith(r2PublicUrl)
        ? media.url.slice(r2PublicUrl.length + 1) // +1 for the slash
        : media.url;

      try {
        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: process.env.S3_BUCKET || "",
            Key: key,
          })
        );
        return { id: media.id, s3Success: true };
      } catch (error) {
        console.error(`S3 delete failed for ${key}:`, error);
        return { id: media.id, s3Success: false };
      }
    });

    const s3Results = await Promise.allSettled(s3Deletes);

    // Collect IDs where S3 delete succeeded
    const successfulS3Deletes = s3Results
      .filter((result) => result.status === "fulfilled" && result.value.s3Success)
      .map((result) => (result as PromiseFulfilledResult<any>).value.id);

    // Delete from DB only if S3 delete succeeded
    if (successfulS3Deletes.length > 0) {
      await prisma.media.deleteMany({
        where: { id: { in: successfulS3Deletes } },
      });
    }

    // Return report
    return NextResponse.json({
      deleted: successfulS3Deletes.length,
      total: mediaRecords.length,
      failed: mediaRecords.length - successfulS3Deletes.length,
    });
  } catch (error) {
    console.error("Bulk media delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
