import { NextResponse } from 'next/server';
import { getEventByCode } from '@/services/event';
import { signToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { code } = await request.json();

        if (!code) {
            return NextResponse.json({ error: 'Missing access code' }, { status: 400 });
        }

        const result = await getEventByCode(code);
        if (!result) {
            return NextResponse.json({ error: 'Invalid access code' }, { status: 401 });
        }

        const { event, role } = result;
        const slug = event.slug;

        const token = await signToken({ slug, role });

        const cookieStore = await cookies();
        cookieStore.set('campus_ops_session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 24 * 60 * 60, // 1 day
        });

        return NextResponse.json({ success: true, role, slug });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
