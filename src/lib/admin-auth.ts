function clean(value?: string | null) {
  return value?.trim() || "";
}

export function getAdminEmails(): string[] {
  return [
    clean(process.env.ADMIN_EMAIL).toLowerCase(),
    clean(process.env.SECONDARY_ADMIN_EMAIL).toLowerCase(),
  ].filter(Boolean);
}

export function isAdminEmail(email?: string | null) {
  const candidate = clean(email).toLowerCase();
  return Boolean(candidate && getAdminEmails().includes(candidate));
}
