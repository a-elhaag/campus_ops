import { notFound } from "next/navigation";
import { getEventWithDetails } from "@/services/event";
import { getTasksForEvent } from "@/services/task";
import { getRSVPsForEvent } from "@/services/rsvp";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TaskBoard from "./task-board";
import RsvpTable from "./rsvp-table";
import EventSettings from "./event-settings";

export default async function ManageDashboard({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("campus_ops_session")?.value;
  if (!token) return notFound();

  const session = await verifyToken(token);
  if (!session || session.slug !== slug) return notFound();

  const role = session.role;

  const event = await getEventWithDetails(slug);
  if (!event) {
    notFound();
  }

  const [tasks, rsvps] = await Promise.all([
    getTasksForEvent(event.id),
    getRSVPsForEvent(event.id),
  ]);

  return (
    <main className="min-h-screen p-4 md:p-8 space-y-8 max-w-7xl mx-auto pt-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {event.title} Hub
          </h1>
          <p className="text-gray-500">
            Master control for event operations and registration.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant={role === "admin" ? "default" : "secondary"}
            className="px-3 py-1 text-sm"
          >
            {role.toUpperCase()}
          </Badge>
          <form action="/api/auth/logout" method="POST" className="inline">
            <button
              type="submit"
              className="text-sm font-medium text-gray-500 hover:text-gray-900 underline underline-offset-4"
            >
              Logout
            </button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="animate-slideUp" style={{ animationDelay: "0ms" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total RSVPs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {event._count?.rsvps ?? 0}
              {event.capacity ? ` / ${event.capacity}` : ""}
            </div>
          </CardContent>
        </Card>
        <Card className="animate-slideUp" style={{ animationDelay: "100ms" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Checked In
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {rsvps.filter((r: any) => r.checked_in).length}
            </div>
          </CardContent>
        </Card>
        <Card className="animate-slideUp" style={{ animationDelay: "200ms" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Pending Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {tasks.filter((t: any) => t.status !== "done").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Task Board</h2>
          <TaskBoard slug={slug} initialTasks={tasks} />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Attendees</h2>
          <RsvpTable slug={slug} initialRsvps={rsvps} />
        </div>
      </div>

      {role === "admin" && (
        <div className="pt-8 border-t border-gray-200 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Event Settings (Admin Only)
          </h2>
          <EventSettings event={event as any} />
        </div>
      )}
    </main>
  );
}
