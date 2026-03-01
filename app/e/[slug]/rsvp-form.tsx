"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RSVPForm({ slug }: { slug: string }) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(`/api/events/${slug}/rsvp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to RSVP");
            }

            setSuccess(true);
        } catch (err: any) {
            setError(err.message);
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
            {error && <div className="text-red-500 text-sm font-medium">{error}</div>}

            <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" required placeholder="Jane Doe" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="contact">Contact Info (Optional)</Label>
                <Input id="contact" name="contact" placeholder="Email or Phone" />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Registering..." : "Confirm RSVP"}
            </Button>
        </form>
    );
}
