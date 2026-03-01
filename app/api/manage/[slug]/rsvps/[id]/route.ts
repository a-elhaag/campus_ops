import { NextResponse } from 'next/server';
import { toggleCheckIn } from '@/services/rsvp';
import { revalidatePath } from 'next/cache';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ slug: string; id: string }> }
) {
    const { slug, id } = await params;
    try {
        const { checked_in } = await request.json();

        if (typeof checked_in !== 'boolean') {
            return NextResponse.json({ error: 'checked_in boolean is required' }, { status: 400 });
        }

        const rsvp = await toggleCheckIn(id, checked_in);

        revalidatePath(`/e/${slug}/manage`);
        return NextResponse.json({ success: true, rsvp });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
