import { redirect } from "next/navigation";
import { isAdminUser } from "@/lib/admin-auth";
import { supabaseServer } from "@/lib/supabase-server";

export { isAdminUser } from "@/lib/admin-auth";

export async function requireAdminSession() {
  const supabase = supabaseServer();
  const { data, error } = await supabase.auth.getUser();
  const user = data.user;

  if (error || !user) {
    redirect("/signin?callbackUrl=/admin/bookings");
  }
  if (!isAdminUser(user)) {
    redirect("/");
  }

  return user;
}
