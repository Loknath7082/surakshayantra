export function validateReturnTo(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  if (value.length === 0 || value.length > 2048) {
    return null;
  }

  // Must start with a single slash and not protocol-relative or backslash
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
    return null;
  }

  // Reject fragment identifier or backslashes in raw input
  if (value.includes("#") || value.includes("\\")) {
    return null;
  }

  // Reject ASCII control characters
  if (/[\x00-\x1F\x7F]/.test(value)) {
    return null;
  }

  let decoded: string;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    return null;
  }

  // Reject surviving percent-encoding (e.g. double-encoded sequences)
  if (/%[0-9a-fA-F]{2}/.test(decoded)) {
    return null;
  }

  // Reject control characters in decoded form
  if (/[\x00-\x1F\x7F]/.test(decoded)) {
    return null;
  }

  // Reject backslashes, fragments, or double slashes in decoded string
  if (decoded.includes("#") || decoded.includes("\\") || decoded.includes("//")) {
    return null;
  }

  if (!decoded.startsWith("/")) {
    return null;
  }

  // Reject dot and dot-dot path segments in pathname
  const [pathname] = decoded.split("?");
  const segments = pathname.split("/");
  if (segments.some((seg) => seg === "." || seg === "..")) {
    return null;
  }

  return value;
}
