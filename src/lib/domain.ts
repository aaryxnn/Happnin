const fallbackDomains = ["umass.edu"];
const demoDomain = "example.edu";

export function getAllowedEmailDomains() {
  const raw = process.env.EXPO_PUBLIC_ALLOWED_EMAIL_DOMAINS;
  if (!raw) return fallbackDomains;
  return raw
    .split(",")
    .map((domain: string) => domain.trim().toLowerCase().replace(/^@/, ""))
    .filter(Boolean);
}

export function getEmailDomain(email: string) {
  return email.trim().toLowerCase().split("@")[1] ?? "";
}

export function isAllowedStudentEmail(email: string) {
  const domain = getEmailDomain(email);
  return domain === demoDomain || getAllowedEmailDomains().includes(domain);
}

export function formatAllowedDomains() {
  return getAllowedEmailDomains()
    .map((domain: string) => `@${domain}`)
    .join(", ");
}
