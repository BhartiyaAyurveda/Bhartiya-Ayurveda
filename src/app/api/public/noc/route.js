import { handleCertificateLookup } from "@/lib/certificate-lookup";
import { getNocData } from "@/lib/noc-data";

export async function POST(request) {
  return handleCertificateLookup(request, {
    label: "NOC",
    key: "noc",
    fetchData: getNocData,
  });
}
