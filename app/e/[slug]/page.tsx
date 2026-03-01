import { notFound } from 'next/navigation';
import { getEventWithDetails } from '@/services/event';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { format } from 'date-fns';
import RSVPForm from './rsvp-form';

export const revalidate = 60; // Cache and revalidate every 60s

export default async function PublicEventPage({ params }: { params: Promise<{ slug: string }> }) {
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
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">{title}</h1>
                        <p className="text-xl text-gray-600 leading-relaxed">{description}</p>
                    </div>

                    <div className="flex flex-col gap-4 py-6 border-y border-gray-200/50">
                        <div className="flex items-center gap-3 text-gray-700">
                            <span className="p-2 glass-panel rounded-full">📅</span>
                            <div>
                                <p className="font-semibold text-gray-900">Date & Time</p>
                                <p>{format(new Date(starts_at), 'EEEE, MMMM do yyyy - h:mm a')}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-gray-700">
                            <span className="p-2 glass-panel rounded-full">📍</span>
                            <div>
                                <p className="font-semibold text-gray-900">Location</p>
                                <p>{location}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-gray-700">
                            <span className="p-2 glass-panel rounded-full">🎟️</span>
                            <div>
                                <p className="font-semibold text-gray-900">Registration</p>
                                <p>{rsvpCount} {capacity ? `/ ${capacity}` : ''} attending</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right column: RSVP Form */}
                <div className="md:col-span-2">
                    <Card className="sticky top-8">
                        <CardHeader className="pb-4">
                            <CardTitle>Reserve your spot</CardTitle>
                            <CardDescription>
                                {isFull ? "This event is currently full." : "Join us by registering below."}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isFull ? (
                                <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg text-sm font-medium text-center">
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
