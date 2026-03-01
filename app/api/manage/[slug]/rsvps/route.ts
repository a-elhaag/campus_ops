import { NextResponse } from 'next/server';
import { getEventBySlug } from '@/services/event';
import { getRSVPsForEvent } from '@/services/rsvp';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    try {
        const event = await getEventBySlug(slug);
        if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });

        const rsvps = await getRSVPsForEvent(event.id);
        return NextResponse.json({ success: true, rsvps });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
