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
      <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200/50 dark:border-green-200/10 text-green-900 dark:text-green-100 rounded-2xl text-center space-y-2">
        <p className="text-lg font-bold">✨ Registration Confirmed</p>
        <p className="text-sm text-green-800 dark:text-green-200">
          Thank you for registering! We'll see you at the event.
        </p>
      </div>
    );
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 ml-2">
          Full Name
        </Label>
        <Input 
          id="name" 
          name="name" 
          required 
          placeholder="Jane Doe" 
          className="h-12 rounded-xl text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700/50 dark:text-gray-100 dark:placeholder-gray-400"
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 ml-2">
          Email Address <span className="text-red-500 font-bold">*</span>
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="jane@example.com"
          className="h-12 rounded-xl text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700/50 dark:text-gray-100 dark:placeholder-gray-400"
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 ml-2">
          Phone Number <span className="text-red-500 font-bold">*</span>
        </Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          required
          placeholder="+1 (555) 123-4567"
          className="h-12 rounded-xl text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700/50 dark:text-gray-100 dark:placeholder-gray-400"
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full neo-vibrant h-12 rounded-2xl text-base font-bold uppercase tracking-widest disabled:opacity-50 transition-all mt-8"
      >
        {loading ? "Registering..." : "Confirm RSVP"}
      </button>
    </form>
  );
}
