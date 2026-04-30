/**
 * Airtable utility for fetching ecosystem partners
 * Supports ISR revalidation (60s)
 */

export interface Attachment {
  id: string;
  url: string;
  filename: string;
  size: number;
  type: string;
  thumbnails?: {
    small: { url: string; width: number; height: number };
    large: { url: string; width: number; height: number };
  };
}

export interface EcosystemPartner {
  id: string;
  name: string;
  description: string;
  logo: string | null;
  featured: boolean;
  verified: boolean;
  url1: string | null;
  url2: string | null;
  date: string | null;
  blackIcon: boolean;
}

interface AirtableRecord {
  id: string;
  fields: {
    [key: string]: any;
  };
  createdTime: string;
}

interface AirtableResponse {
  records: AirtableRecord[];
  offset?: string;
}

export async function getEcosystemPartners(): Promise<EcosystemPartner[]> {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableId = process.env.AIRTABLE_ECOSYSTEM_TABLE;

  // Validate environment variables
  if (!apiKey || !baseId || !tableId) {
    console.warn("Airtable environment variables not configured");
    return [];
  }

  try {
    const url = new URL(
      `https://api.airtable.com/v0/${baseId}/${tableId}`
    );
    url.searchParams.append("view", "viwlkZzQK4CObQlbe");

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      // ISR: revalidate cache every 60 seconds
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error(`Airtable API error: ${response.status} ${response.statusText}`);
      return [];
    }

    const data: AirtableResponse = await response.json();

    // Map Airtable records to our EcosystemPartner type
    const partners: EcosystemPartner[] = (data.records || []).map(
      (record: AirtableRecord) => {
        const fields = record.fields;
        const attachments: Attachment[] = fields["Icon"] || [];
        const logoUrl = attachments?.[0]?.thumbnails?.large?.url || null;

        return {
          id: record.id,
          name: fields["Name of Company"] || "",
          description: fields["Description"] || "",
          logo: logoUrl,
          featured: fields["Feature"] === true,
          verified: fields["Verified"] === true,
          url1: fields["URL 1 (brandkit)"] || null,
          url2: fields["URL 2 (optional)"] || null,
          date: fields["Date"] || null,
          blackIcon: fields["Black icon"] === true,
        };
      }
    );

    // Sort: Featured first, then the rest
    partners.sort((a, b) => {
      if (a.featured === b.featured) return 0;
      return a.featured ? -1 : 1;
    });

    return partners;
  } catch (error) {
    console.error("Error fetching ecosystem partners from Airtable:", error);
    return [];
  }
}
