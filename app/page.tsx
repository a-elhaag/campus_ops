"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarDays, Users, MapPin, KeyRound, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdUrl, setCreatedUrl] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // Basic date conversion
    data.starts_at = new Date(data.starts_at as string).toISOString();
    if (data.capacity) {
      data.capacity = parseInt(data.capacity as string).toString();
    }

    try {
      const response = await fetch('/api/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create event");
      }

      setCreatedUrl(`/e/${result.event.slug}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (createdUrl) {
    return (
      <main className="relative flex min-h-screen flex-col items-center justify-center p-4 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#9D4EDD]/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00B4D8]/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>

        <div className="relative z-10 w-full max-w-md p-8 pt-10 rounded-[2.5rem] neo-flat overflow-hidden text-center">
          <div className="mx-auto w-16 h-16 bg-[#9D4EDD]/10 rounded-[1.5rem] flex items-center justify-center mb-6 border border-[#9D4EDD]/20 shadow-inner">
            <Sparkles className="w-8 h-8 text-[#9D4EDD]" />
          </div>

          <h2 className="text-3xl font-semibold tracking-tight text-gray-900 mb-2">Workspace Ready</h2>
          <p className="text-gray-500 mb-8">Your event environment has been successfully configured.</p>

          <div className="space-y-4">
            <Button
              size="lg"
              className="w-full text-base group relative overflow-hidden transition-all duration-300 hover:scale-[1.02]"
              onClick={() => router.push(createdUrl)}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Public Landing Page <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full text-base group transition-all duration-300 hover:scale-[1.02]"
              onClick={() => router.push(`${createdUrl}/manage`)}
            >
              <span className="flex items-center gap-2 text-gray-700 font-semibold">
                Manage Dashboard
              </span>
            </Button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-300/40 text-left bg-gray-100/30 p-4 rounded-2xl neo-pressed">
            <p className="text-xs font-semibold text-gray-600 flex items-start gap-2">
              <ShieldCheck className="w-5 h-5 text-[#9D4EDD] shrink-0 -mt-0.5" />
              <span>Keep your <strong className="text-gray-800">Admin</strong> and <strong className="text-gray-800">Organizer</strong> codes secure. You will need them to access the dashboard.</span>
            </p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen overflow-hidden flex flex-col justify-center">
      {/* Abstract Background Orbs for Liquid Glass Effect */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-[#9D4EDD]/10 rounded-full mix-blend-multiply filter blur-[100px] opacity-70"></div>
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-[#00B4D8]/10 rounded-full mix-blend-multiply filter blur-[120px] opacity-60"></div>
      <div className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] bg-[#a855f7]/10 rounded-full mix-blend-multiply filter blur-[100px] opacity-70"></div>

      <div className="relative z-10 container mx-auto px-4 md:px-8 py-12 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">

          {/* Left Hero Section */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full neo-flat text-sm font-medium text-gray-700 mb-4">
              <Sparkles className="w-4 h-4 text-[#9D4EDD]" />
              <span>Next-Gen Event Operations</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-semibold tracking-tight text-gray-900 leading-[1.1]">
              Orchestrate<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9D4EDD] to-[#00B4D8]">
                with precision.
              </span>
            </h1>

            <p className="text-xl text-gray-600 font-normal leading-relaxed max-w-lg mx-auto lg:mx-0">
              A meticulously crafted platform for university activities. Launch registrations, manage tasks, and check-in attendees from one beautiful dashboard.
            </p>

            <div className="flex items-center justify-center lg:justify-start gap-8 pt-4">
              <div className="flex flex-col gap-1 items-center lg:items-start text-gray-600">
                <span className="text-3xl font-bold text-[#9D4EDD]">Zero</span>
                <span className="text-sm font-medium">Friction Setup</span>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div className="flex flex-col gap-1 items-center lg:items-start text-gray-600">
                <span className="text-3xl font-bold text-[#00B4D8]">Sync</span>
                <span className="text-sm font-medium">Real-time Tasks</span>
              </div>
            </div>
          </div>

          {/* Right Form Section */}
          <div className="relative mx-auto w-full max-w-lg">
            {/* Soft decorative shadow behind the card */}
            <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full transform -translate-x-4 translate-y-8"></div>

            <div className="relative neo-flat rounded-[2.5rem] p-8 md:p-10">
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-900">Initialize Workspace</h3>
                <p className="text-sm text-gray-500 mt-1">Configure your event parameters.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-3 bg-red-50/80 border border-red-100 rounded-xl text-red-600 text-sm font-medium">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="title" className="text-xs font-semibold uppercase tracking-wider text-gray-500 ml-2">Event Title</Label>
                    <Input id="title" name="title" required placeholder="Spring Tech Mixer 2026" />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="description" className="text-xs font-semibold uppercase tracking-wider text-gray-500 ml-2">Description</Label>
                    <Input id="description" name="description" required placeholder="A brief overview of the event..." />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="starts_at" className="text-xs font-semibold uppercase tracking-wider text-gray-500 ml-2 flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" /> Date</Label>
                      <Input id="starts_at" name="starts_at" type="datetime-local" required className="text-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="capacity" className="text-xs font-semibold uppercase tracking-wider text-gray-500 ml-2 flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Capacity</Label>
                      <Input id="capacity" name="capacity" type="number" placeholder="Optional" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="location" className="text-xs font-semibold uppercase tracking-wider text-gray-500 ml-2 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Location</Label>
                    <Input id="location" name="location" required placeholder="Student Union Building" />
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-gray-300/40">
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-4 ml-2">
                    <KeyRound className="w-4 h-4 text-[#9D4EDD]" />
                    Security Roles
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="organizer_code" className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 ml-2">Organizer Passcode</Label>
                      <Input id="organizer_code" name="organizer_code" required type="password" placeholder="••••••••" className="font-mono placeholder:font-sans" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="admin_code" className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 ml-2">Admin Passcode</Label>
                      <Input id="admin_code" name="admin_code" required type="password" placeholder="••••••••" className="font-mono placeholder:font-sans" />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full mt-6"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2 drop-shadow-sm">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Provisioning...
                    </span>
                  ) : (
                    <span className="drop-shadow-sm">Deploy Event Workspace</span>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
