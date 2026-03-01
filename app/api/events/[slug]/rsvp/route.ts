import { NextResponse } from "next/server";
import { getEventBySlug } from "@/services/event";
import { createRSVP } from "@/services/rsvp";
import { revalidatePath } from "next/cache";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  try {
    const { name, email, phone } = await request.json();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!phone) {
      return NextResponse.json({ error: "Phone is required" }, { status: 400 });
    }

    const event = await getEventBySlug(slug);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Optional: check capacity here

    // Combine email and phone into contact field
    const contact = `${email} | ${phone}`;
    const rsvp = await createRSVP(event.id, { name, contact });

    // Revalidate event page and dashboard
    revalidatePath(`/e/${slug}`);
    revalidatePath(`/e/${slug}/manage`);

    return NextResponse.json({ success: true, rsvp });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
