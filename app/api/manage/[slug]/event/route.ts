import { NextResponse } from 'next/server';
import { updateEventDetails } from '@/services/event';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    try {
        // Admin check
        const cookieStore = await cookies();
        const token = cookieStore.get('campus_ops_session')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const session = await verifyToken(token);
        if (!session || session.role !== 'admin' || session.slug !== slug) {
            return NextResponse.json({ error: 'Forbidden. Admin access required.' }, { status: 403 });
        }

        const data = await request.json();
        const event = await updateEventDetails(slug, data);

        revalidatePath(`/e/${slug}`);
        revalidatePath(`/e/${slug}/manage`);

        return NextResponse.json({ success: true, event });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
