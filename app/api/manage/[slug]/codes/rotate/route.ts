import { NextResponse } from 'next/server';
import { rotateCodes } from '@/services/event';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function POST(
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

        const { admin_code, organizer_code } = await request.json();

        if (!admin_code && !organizer_code) {
            return NextResponse.json({ error: 'At least one new code must be provided' }, { status: 400 });
        }

        await rotateCodes(slug, { admin_code, organizer_code });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
