import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { isAdminEmail } from "@/lib/admin-auth";

export { isAdminEmail } from "@/lib/admin-auth";

export async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/signin?callbackUrl=/admin/bookings");
  }
  if (!isAdminEmail(session.user.email)) {
    redirect("/");
  }
  return session;
}
