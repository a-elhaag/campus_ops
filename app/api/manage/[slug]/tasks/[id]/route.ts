import { NextResponse } from 'next/server';
import { updateTaskStatus } from '@/services/task';
import { revalidatePath } from 'next/cache';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ slug: string; id: string }> }
) {
    const { slug, id } = await params;
    try {
        const { status } = await request.json();

        if (!status) {
            return NextResponse.json({ error: 'Status is required' }, { status: 400 });
        }

        const task = await updateTaskStatus(id, status);

        revalidatePath(`/e/${slug}/manage`);
        return NextResponse.json({ success: true, task });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
