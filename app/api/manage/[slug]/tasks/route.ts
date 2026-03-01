import { NextResponse } from 'next/server';
import { getEventBySlug } from '@/services/event';
import { getTasksForEvent, createTask } from '@/services/task';
import { revalidatePath } from 'next/cache';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    try {
        const event = await getEventBySlug(slug);
        if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });

        const tasks = await getTasksForEvent(event.id);
        return NextResponse.json({ success: true, tasks });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    try {
        const { title, role } = await request.json();

        if (!title || !role) {
            return NextResponse.json({ error: 'Title and role are required' }, { status: 400 });
        }

        const event = await getEventBySlug(slug);
        if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });

        const task = await createTask(event.id, { title, role });

        revalidatePath(`/e/${slug}/manage`);
        return NextResponse.json({ success: true, task });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
