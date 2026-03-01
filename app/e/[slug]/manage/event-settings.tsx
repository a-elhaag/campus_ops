"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/lib/hooks/useToast";
import { Event } from "@prisma/client";
import { Globe, MapPin } from "lucide-react";

export default function EventSettings({ event }: { event: Event }) {
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(event.location === "Online Event");
  const toast = useToast();

  async function handleUpdateEvent(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // If event is online, set location to "Online Event"
    if (isOnline) {
      data.location = "Online Event";
    }

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
    <div className="max-w-2xl space-y-6 p-8 rounded-[2rem] neo-flat">
      <form onSubmit={handleUpdateEvent} className="space-y-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="capacity" className="ml-2">
              Capacity
            </Label>
            <Input
              id="capacity"
              name="capacity"
              type="number"
              defaultValue={event.capacity?.toString() || ""}
              placeholder="Leave empty for unlimited"
            />
          </div>
          <div className="space-y-2">
            <Label className="ml-2">Event Format</Label>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsOnline(false)}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl transition-all ${
                  !isOnline
                    ? "neo-vibrant text-white"
                    : "neo-flat text-gray-600 dark:text-gray-400"
                }`}
              >
                <MapPin size={18} />
                In-Person
              </button>
              <button
                type="button"
                onClick={() => setIsOnline(true)}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl transition-all ${
                  isOnline
                    ? "neo-vibrant text-white"
                    : "neo-flat text-gray-600 dark:text-gray-400"
                }`}
              >
                <Globe size={18} />
                Online
              </button>
            </div>
          </div>
        </div>

        {!isOnline && (
          <div className="space-y-2">
            <Label htmlFor="location" className="ml-2">
              Location <span className="text-red-500">*</span>
            </Label>
            <Input
              id="location"
              name="location"
              defaultValue={
                event.location === "Online Event" ? "" : event.location
              }
              required={!isOnline}
              placeholder="Enter event venue/address"
            />
          </div>
        )}

        {isOnline && (
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-200/10 text-blue-900 dark:text-blue-100">
            <p className="text-sm font-medium">
              ✓ This is an online event. Attendees will not need to enter a
              physical location.
            </p>
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full mt-6"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
