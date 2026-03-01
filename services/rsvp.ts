import prisma from "@/lib/prisma";

export async function getRSVPsForEvent(event_id: string) {
  return prisma.rsvp.findMany({
    where: { event_id },
    orderBy: { created_at: "desc" },
  });
}

export async function createRSVP(
  event_id: string,
  data: { name: string; contact?: string },
) {
  return prisma.rsvp.create({
    data: {
      event_id,
      name: data.name,
      contact: data.contact,
    },
  });
}

export async function toggleCheckIn(rsvp_id: string, checked_in: boolean) {
  return prisma.rsvp.update({
    where: { id: rsvp_id },
    data: { checked_in },
  });
}
