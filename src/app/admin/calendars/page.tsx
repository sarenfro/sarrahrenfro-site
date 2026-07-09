import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/adminAuth";
import { getCalendarUrls } from "@/lib/calendarUrls";
import CalendarsManager from "./CalendarsManager";

export const dynamic = "force-dynamic";

export default async function AdminCalendarsPage() {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  const urls = await getCalendarUrls();

  return <CalendarsManager initial={urls} />;
}
