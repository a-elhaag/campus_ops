import { NextResponse } from 'next/server';
import { createEvent } from '@/services/event';

export async function POST(request: Request) {
    try {
        const data = await request.json();

        if (!data.title || !data.description || !data.starts_at || !data.location || !data.admin_code || !data.organizer_code) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const event = await createEvent({
            title: data.title,
            description: data.description,
            starts_at: new Date(data.starts_at),
            location: data.location,
            capacity: data.capacity ? parseInt(data.capacity) : undefined,
            admin_code: data.admin_code,
            organizer_code: data.organizer_code,
        });

        return NextResponse.json({ success: true, event });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
