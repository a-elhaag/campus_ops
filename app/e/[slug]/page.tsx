import { notFound } from "next/navigation";
import { getEventWithDetails } from "@/services/event";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar, MapPin, Ticket, Globe } from "lucide-react";
import RSVPForm from "./rsvp-form";

export const revalidate = 60; // Cache and revalidate every 60s

export default async function PublicEventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEventWithDetails(slug);

  if (!event) {
    notFound();
  }

  const { title, description, starts_at, location, capacity } = event;
  const rsvpCount = event._count.rsvps;
  const isFull = capacity !== null && rsvpCount >= capacity;

  return (
    <main className="min-h-screen p-4 md:p-8 flex items-start justify-center pt-12 md:pt-24">
      <div className="w-full max-w-4xl grid md:grid-cols-5 gap-8">
        {/* Left column: Event details */}
        <div className="md:col-span-3 space-y-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
              {title}
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              {description}
            </p>
          </div>

          <div className="flex flex-col gap-4 py-6 border-y border-gray-200/50">
            <div className="flex items-center gap-3 text-gray-700 neo-flat p-4 rounded-2xl">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Calendar
                  className="text-blue-600 dark:text-blue-400"
                  size={24}
                />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  Date & Time
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {format(new Date(starts_at), "EEEE, MMMM do yyyy - h:mm a")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-700 neo-flat p-4 rounded-2xl">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                {location === "Online Event" ? (
                  <Globe
                    className="text-green-600 dark:text-green-400"
                    size={24}
                  />
                ) : (
                  <MapPin
                    className="text-green-600 dark:text-green-400"
                    size={24}
                  />
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {location === "Online Event" ? "Event Format" : "Location"}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {location === "Online Event"
                    ? "🌐 Online Event - Join from anywhere"
                    : location}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-700 neo-flat p-4 rounded-2xl">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Ticket
                  className="text-purple-600 dark:text-purple-400"
                  size={24}
                />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  Registration
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {rsvpCount} {capacity ? `/ ${capacity}` : ""} attending
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: RSVP Form */}
        <div className="md:col-span-2">
          <Card className="sticky top-8 neo-flat">
            <CardHeader className="pb-4">
              <CardTitle>Reserve your spot</CardTitle>
              <CardDescription>
                {isFull
                  ? "This event is currently full."
                  : "Join us by registering below."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isFull ? (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 rounded-lg text-sm font-medium text-center border border-yellow-200/50 dark:border-yellow-200/20">
                  Registration is closed (Full capacity)
                </div>
              ) : (
                <RSVPForm slug={slug} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
