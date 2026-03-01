"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { RSVP } from "@prisma/client";
import { format } from "date-fns";
import { Check, X } from "lucide-react";

export default function RsvpTable({ slug, initialRsvps }: { slug: string, initialRsvps: RSVP[] }) {
    const router = useRouter();
    const [rsvps, setRsvps] = useState<RSVP[]>(initialRsvps);

    async function toggleCheckIn(id: string, checked_in: boolean) {
        try {
            const res = await fetch(`/api/manage/${slug}/rsvps/${id}`, {
                method: "PATCH",
                body: JSON.stringify({ checked_in }),
                headers: { "Content-Type": "application/json" }
            });
            if (res.ok) {
                setRsvps(rsvps.map(r => r.id === id ? { ...r, checked_in } : r));
                router.refresh();
            }
        } catch (e) { }
    }

    return (
        <div className="rounded-[2rem] overflow-hidden neo-flat">
            <table className="w-full text-sm text-left">
                <thead className="text-gray-500 uppercase text-[10px] tracking-wider border-b border-gray-300/30">
                    <tr>
                        <th className="px-5 py-4">Name</th>
                        <th className="px-5 py-4">Contact</th>
                        <th className="px-5 py-4">Registered At</th>
                        <th className="px-5 py-4 text-center">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {rsvps.length === 0 && (
                        <tr>
                            <td colSpan={4} className="px-5 py-10 text-center text-gray-500 italic">No attendees registered yet.</td>
                        </tr>
                    )}
                    {rsvps.map(rsvp => (
                        <tr key={rsvp.id} className="border-b last:border-b-0 border-gray-300/30 transition-colors hover:bg-black/5">
                            <td className="px-5 py-4 font-semibold text-gray-800">{rsvp.name}</td>
                            <td className="px-5 py-4 text-gray-600">{rsvp.contact || "-"}</td>
                            <td className="px-5 py-4 text-gray-500">{format(new Date(rsvp.created_at), 'MMM do, h:mm a')}</td>
                            <td className="px-5 py-4 text-center">
                                <button
                                    onClick={() => toggleCheckIn(rsvp.id, !rsvp.checked_in)}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all focus:outline-none ${rsvp.checked_in
                                        ? "neo-pressed text-[#4A6E91]"
                                        : "neo-flat text-gray-500 hover:text-gray-800"
                                        }`}
                                >
                                    {rsvp.checked_in ? (
                                        <>
                                            <Check className="w-3.5 h-3.5" /> Checked In
                                        </>
                                    ) : (
                                        <>
                                            <X className="w-3.5 h-3.5" /> Pending
                                        </>
                                    )}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
