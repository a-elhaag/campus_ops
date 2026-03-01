"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/lib/hooks/useToast";
import { Event } from "@prisma/client";

export default function EventSettings({ event }: { event: Event }) {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  async function handleUpdateEvent(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    if (data.capacity) {
      data.capacity = parseInt(data.capacity as string).toString();
    } else {
      delete data.capacity;
    }

    try {
      const res = await fetch(`/api/manage/${event.slug}/event`, {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        toast.success("Event details updated successfully!");
      } else {
        toast.error("Failed to update event.");
      }
    } catch (e) {
      toast.error("Error updating event.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl space-y-6 p-8 rounded-[2rem] neo-flat">
      <form onSubmit={handleUpdateEvent} className="space-y-4">
        <h3 className="text-xl font-bold text-gray-800">
          Edit Event Information
        </h3>

        <div className="space-y-2">
          <Label htmlFor="title" className="ml-2">
            Event Name
          </Label>
          <Input id="title" name="title" defaultValue={event.title} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="ml-2">
            Description
          </Label>
          <Input
            id="description"
            name="description"
            defaultValue={event.description}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location" className="ml-2">
              Location
            </Label>
            <Input
              id="location"
              name="location"
              defaultValue={event.location}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="capacity" className="ml-2">
              Capacity
            </Label>
            <Input
              id="capacity"
              name="capacity"
              type="number"
              defaultValue={event.capacity?.toString() || ""}
            />
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full mt-4"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
