import type { StaticPageHero } from "./types";

export const pgpKeyContent: {
  readonly hero: StaticPageHero;
  readonly intro: string;
  readonly keyLabel: string;
  readonly publicKeyPlaceholder: string;
  readonly usageInstructions: readonly string[];
  readonly securityEmail: string;
  readonly keyWarning: string;
  readonly keyWarningBody: string;
  readonly fallbackMessage: string;
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
  keyWarning: "Placeholder Key — Do Not Use",
  keyWarningBody:
    "This is a placeholder public key for development purposes only. Encrypted reporting is not currently available. Do not use this key to encrypt security reports.",
  fallbackMessage:
    "Until the official PGP key is published, please submit security reports by email.",
};