import { NextResponse } from 'next/server';
import { getEventWithDetails } from '@/services/event';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    try {
        const event = await getEventWithDetails(slug);
        if (!event) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        // Omit sensitive data
        const { admin_code_hash, organizer_code_hash, ...publicData } = event;

        return NextResponse.json({ success: true, event: publicData });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
