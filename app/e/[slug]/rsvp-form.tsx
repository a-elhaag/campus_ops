"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/lib/hooks/useToast";

export default function RSVPForm({ slug }: { slug: string }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const toast = useToast();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(`/api/events/${slug}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to RSVP");
      }

      setSuccess(true);
      toast.success("Registration confirmed! See you there!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="p-4 bg-[#4A6E91]/10 backdrop-blur-sm border border-[#4A6E91]/20 text-[#24292E] rounded-lg text-sm font-bold text-center">
        ✨ Registration Confirmed!
      </div>
    );
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" name="name" required placeholder="Jane Doe" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
        <Input id="email" name="email" type="email" required placeholder="jane@example.com" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
        <Input id="phone" name="phone" type="tel" required placeholder="+1 (555) 123-4567" />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Registering..." : "Confirm RSVP"}
      </Button>
    </form>
  );
}
