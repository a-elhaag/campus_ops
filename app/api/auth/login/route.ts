import { NextResponse } from 'next/server';
import { getEventBySlug } from '@/services/event';
import { verifyHash, signToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { slug, code } = await request.json();

        if (!slug || !code) {
            return NextResponse.json({ error: 'Missing slug or code' }, { status: 400 });
        }

        const event = await getEventBySlug(slug);
        if (!event) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        const isAdmin = await verifyHash(code, event.admin_code_hash);
        const isOrganizer = await verifyHash(code, event.organizer_code_hash);

        if (!isAdmin && !isOrganizer) {
            return NextResponse.json({ error: 'Invalid code' }, { status: 401 });
        }

        const role = isAdmin ? 'admin' : 'organizer';
        const token = await signToken({ slug, role });

        const cookieStore = await cookies();
        cookieStore.set('campus_ops_session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 24 * 60 * 60, // 1 day
        });

        return NextResponse.json({ success: true, role });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
