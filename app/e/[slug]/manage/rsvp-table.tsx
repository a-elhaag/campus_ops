"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { RSVP } from "@/lib/types";
import { format } from "date-fns";
import { Check, X, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/lib/hooks/useToast";

export default function RsvpTable({
  slug,
  initialRsvps,
}: {
  slug: string;
  initialRsvps: RSVP[];
}) {
  const router = useRouter();
  const toast = useToast();
  const [rsvps, setRsvps] = useState<RSVP[]>(initialRsvps);

  async function toggleCheckIn(id: string, checked_in: boolean) {
    // Optimistic update
    setRsvps((prev) =>
      prev.map((r) => (r.id === id ? { ...r, checked_in } : r)),
    );

    try {
      const res = await fetch(`/api/manage/${slug}/rsvps/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ checked_in }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        toast.success(
          checked_in ? "Attendee checked in!" : "Check-in status removed",
        );
        router.refresh();
      } else {
        // Revert on failure
        setRsvps((prev) =>
          prev.map((r) =>
            r.id === id ? { ...r, checked_in: !checked_in } : r,
          ),
        );
        toast.error("Failed to update check-in status");
      }
    } catch (e) {
      // Revert on error
      setRsvps((prev) =>
        prev.map((r) => (r.id === id ? { ...r, checked_in: !checked_in } : r)),
      );
      toast.error("Error updating check-in status");
    }
  }

  function exportToExcel() {
    if (rsvps.length === 0) {
      toast.warning("No attendees to export");
      return;
    }

    const headers = ["Name", "Contact", "Registered At", "Status"];
    const rows = rsvps.map((r) => [
      r.name.replace(/"/g, '""'),
      (r.contact || "").replace(/"/g, '""'),
      format(new Date(r.created_at), "yyyy-MM-dd HH:mm:ss"),
      r.checked_in ? "Checked In" : "Pending",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `rsvps-${slug}-${format(new Date(), "yyyyMMdd-HHmmss")}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${rsvps.length} attendees to CSV`);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end pr-2">
        <button
          onClick={exportToExcel}
          disabled={rsvps.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2 neo-flat rounded-xl text-xs font-bold uppercase tracking-widest text-[#4A6E91] hover:text-[#24292E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <Download className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
          Export Excel
        </button>
      </div>

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
                <td
                  colSpan={4}
                  className="px-5 py-10 text-center text-gray-500 italic"
                >
                  No attendees registered yet.
                </td>
              </tr>
            )}
            <AnimatePresence mode="popLayout">
              {rsvps.map((rsvp, index) => (
                <motion.tr
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  key={rsvp.id}
                  className="border-b last:border-b-0 border-gray-300/30 transition-colors hover:bg-black/5"
                >
                  <td className="px-5 py-4 font-semibold text-gray-800">
                    {rsvp.name}
                  </td>
                  <td className="px-5 py-4 text-gray-600">
                    {rsvp.contact || "-"}
                  </td>
                  <td className="px-5 py-4 text-gray-500">
                    {format(new Date(rsvp.created_at), "MMM do, h:mm a")}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleCheckIn(rsvp.id, !rsvp.checked_in)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all focus:outline-none ${
                        rsvp.checked_in
                          ? "neo-pressed text-[#4A6E91]"
                          : "neo-flat text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      {rsvp.checked_in ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" /> Checked In
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex items-center gap-1.5"
                        >
                          <X className="w-3.5 h-3.5" /> Pending
                        </motion.div>
                      )}
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
