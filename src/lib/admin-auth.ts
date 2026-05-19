type AdminCredential = {
  email: string;
  password: string;
};

function clean(value?: string | null) {
  return value?.trim() || "";
}

export function getAdminCredentials(): AdminCredential[] {
  const pairs: AdminCredential[] = [];

  const primaryEmail = clean(process.env.ADMIN_EMAIL).toLowerCase();
  const primaryPassword = clean(process.env.ADMIN_PASSWORD);
  if (primaryEmail && primaryPassword) {
    pairs.push({ email: primaryEmail, password: primaryPassword });
  }

  const secondaryEmail = clean(process.env.SECONDARY_ADMIN_EMAIL).toLowerCase();
  const secondaryPassword = clean(process.env.SECONDARY_ADMIN_PASSWORD);
  if (secondaryEmail && secondaryPassword) {
    pairs.push({ email: secondaryEmail, password: secondaryPassword });
  }

  return pairs;
}

export function isAdminEmail(email?: string | null) {
  const candidate = clean(email).toLowerCase();
  return Boolean(candidate && getAdminCredentials().some(admin => admin.email === candidate));
}

export function isValidAdminCredential(username?: string | null, password?: string | null) {
  const candidateEmail = clean(username).toLowerCase();
  const candidatePassword = clean(password);
  if (!candidateEmail || !candidatePassword) return null;
  const match = getAdminCredentials().find(
    admin => admin.email === candidateEmail && admin.password === candidatePassword,
  );
  return match?.email ?? null;
}
