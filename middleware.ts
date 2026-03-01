import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('campus_ops_session')?.value;
    const { pathname } = request.nextUrl;

    const isManageRoute = pathname.includes('/manage');
    const isManageApi = pathname.startsWith('/api/manage');

    if (isManageRoute || isManageApi) {
        const slugMatch = pathname.match(/(?:\/e\/|\/api\/manage\/)([^\/]+)/);
        const slug = slugMatch ? slugMatch[1] : null;

        if (!token) {
            if (isManageApi) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            return NextResponse.redirect(new URL(slug ? `/e/${slug}/login` : '/', request.url));
        }

        const session = await verifyToken(token);
        if (!session) {
            const response = isManageApi
                ? NextResponse.json({ error: 'Invalid session' }, { status: 401 })
                : NextResponse.redirect(new URL(slug ? `/e/${slug}/login` : '/', request.url));
            response.cookies.delete('campus_ops_session');
            return response;
        }

        if (slug && session.slug !== slug) {
            if (isManageApi) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            return NextResponse.redirect(new URL(`/e/${session.slug}/manage`, request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/e/:slug/manage/:path*', '/api/manage/:path*'],
};
