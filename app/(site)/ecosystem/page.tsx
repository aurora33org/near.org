import { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { getEcosystemPartners } from "@/lib/airtable";

export const metadata: Metadata = {
  title: "Ecosystem | NEAR",
  description:
    "Explore the vibrant ecosystem of companies and projects building on NEAR Protocol.",
};

// Get first two initials of company name for fallback avatar
function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  return (words[0][0] + words[1][0]).toUpperCase();
}

export default async function EcosystemPage() {
  const partners = await getEcosystemPartners();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              NEAR Ecosystem
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the innovative companies and projects building the future
              on NEAR Protocol.
            </p>
          </div>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {partners.length === 0 ? (
            // Empty State
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                Companies coming soon. Check back later!
              </p>
            </div>
          ) : (
            // Grid of Partner Cards
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200 flex flex-col"
                >
                  {/* Header with logo and badges */}
                  <div className="flex items-start justify-between mb-4">
                    {/* Logo or Avatar */}
                    <div className="flex-shrink-0">
                      {partner.logo ? (
                        <img
                          src={partner.logo}
                          alt={partner.name}
                          className="w-12 h-12 object-contain"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-sm font-bold text-gray-600">
                            {getInitials(partner.name)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Badges */}
                    <div className="flex gap-2">
                      {partner.featured && (
                        <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
                          Featured
                        </span>
                      )}
                      {partner.verified && (
                        <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                          Verified
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Company Name */}
                  <h3 className="text-lg font-bold mb-2">{partner.name}</h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-grow">
                    {partner.description}
                  </p>

                  {/* Link */}
                  {partner.url1 && (
                    <div className="flex items-center gap-2">
                      <a
                        href={partner.url1}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                      >
                        Visit <ExternalLink size={14} />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
