import { NextResponse } from "next/server";
import { createEvent } from "@/services/event";
import { EventCategoryValues } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.title || !data.description || !data.starts_at || !data.location) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate category if provided, default to General
    const category =
      data.category &&
      Object.values(EventCategoryValues).includes(data.category)
        ? data.category
        : EventCategoryValues.General;

    const { event, organizer_code, admin_code } = await createEvent({
      title: data.title,
      description: data.description,
      category,
      starts_at: new Date(data.starts_at),
      location: data.location,
      capacity: data.capacity ? parseInt(data.capacity) : undefined,
    });

    return NextResponse.json({
      success: true,
      event,
      organizer_code,
      admin_code,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
