import { redirect } from "next/navigation";
import { isAdminEmail } from "@/lib/admin-auth";
import { supabaseServer } from "@/lib/supabase-server";

export { isAdminEmail } from "@/lib/admin-auth";

export async function requireAdminSession() {
  const supabase = supabaseServer();
  const { data, error } = await supabase.auth.getUser();
  const user = data.user;

  if (error || !user?.email) {
    redirect("/signin?callbackUrl=/admin/bookings");
  }
  if (!isAdminEmail(user.email)) {
    redirect("/");
  }

  return user;
}
