"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/lib/hooks/useToast";
import type { Event } from "@prisma/client";
import { Globe, MapPin, AlertCircle, CheckCircle2 } from "lucide-react";

interface FormErrors {
  title?: string;
  description?: string;
  location?: string;
  capacity?: string;
}

export default function EventSettings({ event }: { event: Event }) {
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(event.location === "Online Event");
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState({
    title: false,
    description: false,
    location: false,
    capacity: false,
  });
  const toast = useToast();

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "title":
        if (!value.trim()) return "Event name is required";
        if (value.trim().length < 3)
          return "Event name must be at least 3 characters";
        return undefined;
      case "description":
        if (!value.trim()) return "Description is required";
        if (value.trim().length < 10)
          return "Description must be at least 10 characters";
        return undefined;
      case "location":
        if (!isOnline && !value.trim())
          return "Location is required for in-person events";
        return undefined;
      case "capacity":
        if (value && isNaN(Number(value))) return "Capacity must be a number";
        if (value && Number(value) < 1) return "Capacity must be at least 1";
        return undefined;
      default:
        return undefined;
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (touched[name as keyof typeof touched]) {
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  async function handleUpdateEvent(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // Validate all fields
    const titleError = validateField("title", data.title as string);
    const descError = validateField("description", data.description as string);
    const locError = validateField("location", data.location as string);
    const capError = validateField("capacity", data.capacity as string);

    setErrors({
      title: titleError,
      description: descError,
      location: locError,
      capacity: capError,
    });

    if (titleError || descError || locError || capError) {
      toast.error("Please fix the errors in the form");
      setLoading(false);
      return;
    }

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
        throw new Error("Failed to update event.");
      }
    } catch (e: any) {
      toast.error(e.message || "Error updating event.");
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
          <div className="flex items-center gap-1 ml-2">
            <Label
              htmlFor="title"
              className="uppercase tracking-widest text-xs font-semibold text-gray-700 dark:text-gray-300"
            >
              Event Name
            </Label>
            <span className="text-red-500">*</span>
          </div>
          <Input
            id="title"
            name="title"
            defaultValue={event.title}
            required
            className={`h-12 ${
              errors.title && touched.title
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                : "border-gray-300"
            }`}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          {touched.title && !errors.title && (
            <div className="animate-slideUp flex items-center gap-2 text-green-600 text-sm">
              <CheckCircle2 size={16} className="animate-checkmark" />
              <span>Event name looks good</span>
            </div>
          )}
          {errors.title && touched.title && (
            <div className="animate-slideUp flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle size={16} />
              <span>{errors.title}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1 ml-2">
            <Label
              htmlFor="description"
              className="uppercase tracking-widest text-xs font-semibold text-gray-700 dark:text-gray-300"
            >
              Description
            </Label>
            <span className="text-red-500">*</span>
          </div>
          <Input
            id="description"
            name="description"
            defaultValue={event.description}
            required
            className={`h-12 ${
              errors.description && touched.description
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                : "border-gray-300"
            }`}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          {touched.description && !errors.description && (
            <div className="animate-slideUp flex items-center gap-2 text-green-600 text-sm">
              <CheckCircle2 size={16} className="animate-checkmark" />
              <span>Description looks good</span>
            </div>
          )}
          {errors.description && touched.description && (
            <div className="animate-slideUp flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle size={16} />
              <span>{errors.description}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="capacity"
              className="ml-2 uppercase tracking-widest text-xs font-semibold text-gray-700 dark:text-gray-300"
            >
              Capacity
            </Label>
            <Input
              id="capacity"
              name="capacity"
              type="number"
              defaultValue={event.capacity?.toString() || ""}
              placeholder="Leave empty for unlimited"
              className={`h-12 ${
                errors.capacity && touched.capacity
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : "border-gray-300"
              }`}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            {touched.capacity && !errors.capacity && (
              <div className="animate-slideUp flex items-center gap-2 text-green-600 text-sm">
                <CheckCircle2 size={16} className="animate-checkmark" />
                <span>Capacity is valid</span>
              </div>
            )}
            {errors.capacity && touched.capacity && (
              <div className="animate-slideUp flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle size={16} />
                <span>{errors.capacity}</span>
              </div>
            )}
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
            <div className="flex items-center gap-1 ml-2">
              <Label
                htmlFor="location"
                className="uppercase tracking-widest text-xs font-semibold text-gray-700 dark:text-gray-300"
              >
                Location
              </Label>
              <span className="text-red-500">*</span>
            </div>
            <Input
              id="location"
              name="location"
              defaultValue={
                event.location === "Online Event" ? "" : event.location
              }
              required={!isOnline}
              placeholder="Enter event venue/address"
              className={`h-12 ${
                errors.location && touched.location
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : "border-gray-300"
              }`}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            {touched.location && !errors.location && (
              <div className="animate-slideUp flex items-center gap-2 text-green-600 text-sm">
                <CheckCircle2 size={16} className="animate-checkmark" />
                <span>Location looks good</span>
              </div>
            )}
            {errors.location && touched.location && (
              <div className="animate-slideUp flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle size={16} />
                <span>{errors.location}</span>
              </div>
            )}
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
          className="w-full mt-6 uppercase tracking-widest"
          disabled={loading}
          isLoading={loading}
        >
          Save Changes
        </Button>
      </form>
    </div>
  );
}
