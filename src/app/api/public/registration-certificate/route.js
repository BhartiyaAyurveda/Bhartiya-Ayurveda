import { handleCertificateLookup } from "@/lib/certificate-lookup";
import { getRegistrationCertificateData } from "@/lib/registration-certificate-data";

export async function POST(request) {
  return handleCertificateLookup(request, {
    label: "Registration certificate",
    key: "certificate",
    fetchData: getRegistrationCertificateData,
  });
}
