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
    <main className="relative min-h-screen p-4 md:p-12 lg:p-16 flex items-start justify-center pt-8 md:pt-16 bg-[#F1F4F9] dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800">
      {/* Background elements for homepage consistency */}
      <div className="fixed -top-40 -right-40 w-[500px] h-[500px] bg-[#4A6E91]/05 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 pointer-events-none dark:opacity-20"></div>
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-[#85929E]/05 rounded-full mix-blend-multiply filter blur-[120px] opacity-60 pointer-events-none dark:opacity-15"></div>

      <div className="w-full max-w-7xl grid lg:grid-cols-12 gap-12 lg:gap-16 relative z-10">
        {/* Left column: Event details */}
        <div className="lg:col-span-7 space-y-10">
          <div className="space-y-6">
            <h1 className="text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-gray-100 leading-[1.1]">
              {title}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl">
              {description}
            </p>
          </div>

          <div className="flex flex-col gap-6 pt-6">
            <div className="neo-flat dark:bg-gray-800/50 rounded-[2.5rem] p-8 lg:p-12 space-y-5">
              <div className="w-16 h-16 rounded-2xl neo-pressed dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                <Calendar
                  className="text-blue-600 dark:text-blue-400"
                  size={32}
                />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Date & Time
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  {format(new Date(starts_at), "EEEE, MMMM do yyyy - h:mm a")}
                </p>
              </div>
            </div>

            <div className="neo-flat dark:bg-gray-800/50 rounded-[2.5rem] p-8 lg:p-12 space-y-5">
              <div className="w-16 h-16 rounded-2xl neo-pressed dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                {location === "Online Event" ? (
                  <Globe
                    className="text-green-600 dark:text-green-400"
                    size={32}
                  />
                ) : (
                  <MapPin
                    className="text-green-600 dark:text-green-400"
                    size={32}
                  />
                )}
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {location === "Online Event" ? "Event Format" : "Location"}
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  {location === "Online Event"
                    ? "You won't be required to submit your physical location"
                    : location}
                </p>
              </div>
            </div>

            <div className="neo-flat dark:bg-gray-800/50 rounded-[2.5rem] p-8 lg:p-12 space-y-5">
              <div className="w-16 h-16 rounded-2xl neo-pressed dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                <Ticket
                  className="text-purple-600 dark:text-purple-400"
                  size={32}
                />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Registration
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  {rsvpCount} {capacity ? `/ ${capacity}` : ""} people attending
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: RSVP Form */}
        <div className="lg:col-span-5">
          <Card className="sticky top-12 neo-flat dark:bg-gray-800/50 rounded-[2.5rem] dark:border-gray-700 border-gray-200">
            <CardHeader className="pb-6">
              <CardTitle className="text-3xl lg:text-4xl font-bold">
                {isFull ? "Event Full" : "Join us"}
              </CardTitle>
              <CardDescription className="text-base mt-2">
                {isFull
                  ? "This event is currently at full capacity."
                  : "Complete the form below to secure your spot."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isFull ? (
                <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 rounded-2xl text-base font-semibold text-center border border-yellow-200/50 dark:border-yellow-200/20">
                  Registration Closed (Capacity Reached)
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
