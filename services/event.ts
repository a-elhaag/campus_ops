import prisma from "@/lib/prisma";

export async function createEvent(data: {
  title: string;
  description: string;
  starts_at: Date;
  location: string;
  capacity?: number;
  category?: string; // EventCategory from @/lib/types
}) {
  const now = new Date();
  const datePart = now.toISOString().split("T")[0].replace(/-/g, "");
  const timePart =
    now.getHours().toString().padStart(2, "0") +
    now.getMinutes().toString().padStart(2, "0");
  const randomPart = () =>
    Math.random().toString(36).substring(2, 6).toUpperCase();

  const organizer_code = `ORG-${datePart}-${timePart}-${randomPart()}`;
  const admin_code = `ADM-${datePart}-${timePart}-${randomPart()}`;

  const slug =
    data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") +
    "-" +
    Math.random().toString(36).substring(2, 6);

  const event = await prisma.event.create({
    data: {
      slug,
      title: data.title,
      description: data.description,
      starts_at: data.starts_at,
      location: data.location,
      capacity: data.capacity,
      category: data.category,
      admin_code,
      organizer_code,
    },
  });

  return { event, organizer_code, admin_code };
}

export async function getEventBySlug(slug: string) {
  return prisma.event.findUnique({
    where: { slug },
  });
}

export async function getEventByCode(code: string) {
  const adminEvent = await prisma.event.findUnique({
    where: { admin_code: code },
  });
  if (adminEvent) return { event: adminEvent, role: "admin" };

  const organizerEvent = await prisma.event.findUnique({
    where: { organizer_code: code },
  });
  if (organizerEvent) return { event: organizerEvent, role: "organizer" };

  return null;
}

export async function getEventWithDetails(slug: string) {
  return prisma.event.findUnique({
    where: { slug },
    include: {
      _count: {
        select: { rsvps: true, tasks: true },
      },
    },
  });
}

export async function updateEventDetails(
  slug: string,
  data: {
    title?: string;
    description?: string;
    location?: string;
    starts_at?: Date;
    capacity?: number;
  },
) {
  return prisma.event.update({
    where: { slug },
    data,
  });
}

export async function rotateCodes(
  slug: string,
  codes: { admin_code?: string; organizer_code?: string },
) {
  const data: Record<string, string> = {};
  if (codes.admin_code) data.admin_code = codes.admin_code;
  if (codes.organizer_code) data.organizer_code = codes.organizer_code;

  if (Object.keys(data).length === 0) return null;

  return prisma.event.update({
    where: { slug },
    data,
  });
}
