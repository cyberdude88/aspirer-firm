import type { User } from "/supabase-js";

type AdminLikeUser = Pick<User, "app_metadata"> | null | undefined;

function readRole(user: AdminLikeUser) {
  const role = user?.app_metadata?.role;
  return typeof role === "string" ? role.toLowerCase() : "";
}

export function isAdminUser(user: AdminLikeUser) {
  return Boolean(user && (user.app_metadata?.is_admin === true || readRole(user) === "admin"));
}
