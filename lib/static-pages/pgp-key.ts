import type { StaticPageHero } from "./types";

export const pgpKeyContent: {
  readonly hero: StaticPageHero;
  readonly intro: string;
  readonly keyLabel: string;
  readonly publicKeyPlaceholder: string;
  readonly usageInstructions: readonly string[];
  readonly securityEmail: string;
} = {
  hero: {
    title: "PGP Key",
    subtitle: "Use our public key to encrypt sensitive communications.",
  },
  intro:
    "When sending sensitive information — such as vulnerability reports or confidential messages — please encrypt your message to our public key.",
  keyLabel: "Public Key (Placeholder — to be replaced with the real key)",
  publicKeyPlaceholder: `-----BEGIN PGP PUBLIC KEY BLOCK-----
PLACEHOLDER — REPLACE WITH ACTUAL PUBLIC KEY BEFORE PUBLISHING
-----END PGP PUBLIC KEY BLOCK-----`,
  usageInstructions: [
    "Import the key into your PGP client",
    "Encrypt your message to this key",
  ],
  securityEmail: "security@surakshayantra.com",
};
