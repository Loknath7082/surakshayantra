/**
 * Blocklist of disposable email domains.
 * Keep in sync with Clerk dashboard email domain restrictions.
 */
export const DISPOSABLE_DOMAINS = [
  "10minutemail.com",
  "burnermail.io",
  "dispostable.com",
  "dropmail.me",
  "fakeinbox.com",
  "getairmail.com",
  "getnada.com",
  "guerrillamail.biz",
  "guerrillamail.com",
  "guerrillamail.de",
  "guerrillamail.net",
  "guerrillamail.org",
  "guerrillamailblock.com",
  "mailinator.com",
  "sharklasers.com",
  "temp-mail.org",
  "tempmail.com",
  "tempmailaddress.com",
  "throwawaymail.com",
  "yopmail.com",
] as const;

const disposableSet = new Set<string>(DISPOSABLE_DOMAINS);

export function isDisposableEmail(email: string): boolean {
  if (!email || typeof email !== "string") {
    return false;
  }
  const atIndex = email.lastIndexOf("@");
  if (atIndex === -1) {
    return false;
  }
  const domain = email.slice(atIndex + 1).trim().toLowerCase();
  if (!domain) {
    return false;
  }
  return disposableSet.has(domain);
}
