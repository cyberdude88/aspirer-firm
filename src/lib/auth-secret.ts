export function getAuthSecret() {
  return process.env.NEXTAUTH_SECRET || process.env.ADMIN_SECRET;
}
