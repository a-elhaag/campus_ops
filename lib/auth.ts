import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');

export type SessionPayload = {
    slug: string;
    role: 'organizer' | 'admin';
    exp: number;
} & JWTPayload;

export async function signToken(payload: Omit<SessionPayload, 'exp'>) {
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day
    return new SignJWT({ ...payload, exp: Math.floor(expiresAt.getTime() / 1000) })
        .setProtectedHeader({ alg: 'HS256' })
        .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET, {
            algorithms: ['HS256'],
        });
        return payload as SessionPayload;
    } catch (error) {
        return null;
    }
}

export async function hashString(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyHash(data: string, hash: string): Promise<boolean> {
    const dataHash = await hashString(data);
    return dataHash === hash;
}
