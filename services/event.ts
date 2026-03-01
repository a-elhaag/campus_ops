import prisma from '@/lib/prisma';
import { hashString } from '@/lib/auth';


export async function createEvent(data: {
    title: string;
    description: string;
    starts_at: Date;
    location: string;
    capacity?: number;
}) {
    const now = new Date();
    const datePart = now.toISOString().split('T')[0].replace(/-/g, '');
    const timePart = now.getHours().toString().padStart(2, '0') + now.getMinutes().toString().padStart(2, '0');
    const randomPart = () => Math.random().toString(36).substring(2, 6).toUpperCase();

    const organizer_code = `ORG-${datePart}-${timePart}-${randomPart()}`;
    const admin_code = `ADM-${datePart}-${timePart}-${randomPart()}`;

    const admin_code_hash = await hashString(admin_code);
    const organizer_code_hash = await hashString(organizer_code);

    const slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + '-' + Math.random().toString(36).substring(2, 6);

    const event = await prisma.event.create({
        data: {
            slug,
            title: data.title,
            description: data.description,
            starts_at: data.starts_at,
            location: data.location,
            capacity: data.capacity,
            admin_code_hash,
            organizer_code_hash,
        },
    });

    return { event, organizer_code, admin_code };
}

export async function getEventBySlug(slug: string) {
    return prisma.event.findUnique({
        where: { slug },
    });
}

export async function getEventWithDetails(slug: string) {
    return prisma.event.findUnique({
        where: { slug },
        include: {
            _count: {
                select: { rsvps: true, tasks: true }
            }
        }
    });
}

export async function updateEventDetails(slug: string, data: {
    title?: string;
    description?: string;
    location?: string;
    starts_at?: Date;
    capacity?: number;
}) {
    return prisma.event.update({
        where: { slug },
        data,
    });
}

export async function rotateCodes(slug: string, codes: { admin_code?: string; organizer_code?: string }) {
    const data: Record<string, string> = {};
    if (codes.admin_code) data.admin_code_hash = await hashString(codes.admin_code);
    if (codes.organizer_code) data.organizer_code_hash = await hashString(codes.organizer_code);

    if (Object.keys(data).length === 0) return null;

    return prisma.event.update({
        where: { slug },
        data,
    });
}
