"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/ui/logo";
import { CalendarDays, Users, MapPin, KeyRound, ShieldCheck, ArrowRight, Sparkles, Clock, CheckCircle2, Copy, X, Layers, Zap, Database } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"deploy" | "manage">("deploy");
  const [loginCode, setLoginCode] = useState("");
  const [successData, setSuccessData] = useState<{
    url: string;
    organizer_code: string;
    admin_code: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data: Record<string, any> = Object.fromEntries(formData.entries());

    if (data.event_date && data.event_time) {
      data.starts_at = new Date(`${data.event_date}T${data.event_time}`).toISOString();
      delete data.event_date;
      delete data.event_time;
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

      setSuccessData({
        url: `/e/${result.event.slug}`,
        organizer_code: result.organizer_code,
        admin_code: result.admin_code
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: loginCode })
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Login failed");
      }

      const result = await response.json();
      router.push(`/e/${result.slug}/manage`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (successData) {
    return (
      <main className="relative flex min-h-screen flex-col items-center justify-center p-4 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#4A6E91]/10 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#85929E]/10 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-10 w-full max-w-lg p-8 pt-10 rounded-[2.5rem] neo-flat overflow-hidden"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-16 h-16 bg-slate-100 rounded-[1.5rem] flex items-center justify-center mb-6 border border-slate-200 shadow-inner"
            >
              <CheckCircle2 className="w-8 h-8 text-slate-600" />
            </motion.div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Workspace Ready</h2>
            <p className="text-gray-500">Your event environment has been successfully generated.</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="p-5 rounded-2xl neo-pressed space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#4A6E91]/10 flex items-center justify-center text-[#4A6E91]">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">Admin Code</span>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(successData.admin_code)}
                  className="p-2 rounded-lg hover:bg-black/5 text-gray-400 hover:text-[#4A6E91] transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <div className="font-mono text-lg bg-black/5 p-3 rounded-xl text-center border border-white/50 text-[#4A6E91] font-bold">
                {successData.admin_code}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#85929E]/10 flex items-center justify-center text-[#85929E]">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">Organizer Code</span>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(successData.organizer_code)}
                  className="p-2 rounded-lg hover:bg-black/5 text-gray-400 hover:text-[#85929E] transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <div className="font-mono text-lg bg-black/5 p-3 rounded-xl text-center border border-white/50 text-[#85929E] font-bold">
                {successData.organizer_code}
              </div>
            </div>
            <p className="text-[11px] text-center text-gray-400 px-4">
              <ShieldCheck className="w-3.5 h-3.5 inline mr-1 mb-0.5" />
              These codes are generated once for security. Store them safely.
            </p>
          </div>

          <div className="space-y-4">
            <Button
              size="lg"
              className="w-full text-base group relative overflow-hidden transition-all duration-300 transform active:scale-95"
              onClick={() => router.push(successData.url)}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Launch Public Site <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full text-base group transform active:scale-95"
              onClick={() => router.push(`${successData.url}/manage`)}
            >
              <span className="flex items-center gap-2 text-gray-700 font-bold">
                Enter Management Dashboard
              </span>
            </Button>
          </div>
        </motion.div>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen flex flex-col bg-[#F1F4F9]">
      {/* Background elements (fixed so they don't scroll heavily) */}
      <div className="fixed -top-40 -left-40 w-[500px] h-[500px] bg-[#4A6E91]/05 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 pointer-events-none"></div>
      <div className="fixed top-1/4 right-0 w-[600px] h-[600px] bg-[#85929E]/05 rounded-full mix-blend-multiply filter blur-[120px] opacity-60 pointer-events-none"></div>

      <div className="relative z-10 container mx-auto px-4 md:px-8 max-w-7xl">
        {/* Navigation Header */}
        <nav className="flex items-center justify-between py-8">
          <Logo className="w-10 h-10" />
          <div className="flex items-center gap-6">
            <a href="#features" className="text-xs font-bold text-gray-400 hover:text-gray-900 uppercase tracking-widest transition-colors">Features</a>
            <a href="#faq" className="text-xs font-bold text-gray-400 hover:text-gray-900 uppercase tracking-widest transition-colors">FAQ</a>
            <Button variant="outline" size="sm" className="hidden md:flex rounded-xl neo-flat text-[10px] font-bold uppercase tracking-widest px-6" onClick={() => setMode("manage")}>
              Login
            </Button>
          </div>
        </nav>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start pt-12 lg:pt-24">

          {/* Left side: Scrolling Features */}
          <div className="lg:col-span-7 space-y-24 pb-24">
            <div className="space-y-8 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full neo-flat text-sm font-medium text-gray-700 mb-4"
              >
                <Sparkles className="w-4 h-4 text-[#4A6E91]" />
                <span className="uppercase tracking-widest text-[10px] font-bold">Campus Operations Suite</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1]"
              >
                Orchestrate<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#24292E] via-[#4A6E91] to-[#85929E]">
                  with precision.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-600 font-normal leading-relaxed max-w-lg mx-auto lg:mx-0"
              >
                A meticulously crafted platform for university activities. Launch registrations, manage tasks, and check-in attendees from one beautiful dashboard.
              </motion.p>
            </div>

            {/* Feature Blocks */}
            <div id="features" className="space-y-12">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="neo-flat rounded-[2.5rem] p-8 lg:p-12 space-y-6"
              >
                <div className="w-16 h-16 rounded-2xl neo-pressed flex items-center justify-center bg-[#F1F4F9]">
                  <Layers className="w-8 h-8 text-[#4A6E91]" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">Task Management</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Assign logistical, catering, or technical duties to your team. Monitor progress through a centralized "Active Operations" board where every update is visible in real-time.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="neo-flat rounded-[2.5rem] p-8 lg:p-12 space-y-6"
              >
                <div className="w-16 h-16 rounded-2xl neo-pressed flex items-center justify-center bg-[#F1F4F9]">
                  <Zap className="w-8 h-8 text-[#85929E]" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">Digital Check-ins</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Ditch the paper lists. Scan QR codes or use our rapid-search attendee table to check people in as they arrive. Keep track of event capacity and actual attendance live.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="neo-flat rounded-[2.5rem] p-8 lg:p-12 space-y-6"
              >
                <div className="w-16 h-16 rounded-2xl neo-pressed flex items-center justify-center bg-[#F1F4F9]">
                  <Database className="w-8 h-8 text-[#24292E]" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">Data Portability</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Your attendee data belongs to you. Export the entire RSVP list to Excel/CSV with a single click at any point during or after the event for post-mission reporting.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="neo-flat rounded-[2.5rem] p-8 lg:p-12 space-y-6"
              >
                <div className="w-16 h-16 rounded-2xl neo-pressed flex items-center justify-center bg-[#F1F4F9]">
                  <ShieldCheck className="w-8 h-8 text-[#4A6E91]" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">Secure Access Roles</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Separate "Admin" and "Organizer" levels ensure volunteers see what they need, while sensitive settings and code rotation remain under your exclusive control.
                </p>
              </motion.div>
            </div>

            {/* FAQ Section */}
            <div id="faq" className="pt-12 space-y-10">
              <h2 className="text-4xl font-bold text-gray-900 ml-4">Common Protocols</h2>
              <div className="space-y-4">
                {[
                  { q: "How do I invite organizers?", a: "Once you deploy an event, you'll receive an Organizer Code. Provide this code to your team members for console access." },
                  { q: "Is registration real-time?", a: "Yes. The moment someone RSVPs through your public event link, they appear instantly in your management attendee table." },
                  { q: "Can I limit total participants?", a: "Absolutely. Set a capacity during initialization, and we'll automatically disable RSVPs once the target is reached." },
                  { q: "What happens to the codes?", a: "Codes are generated once. If you suspect a breach, Admins can rotate both Admin and Organizer codes from the settings panel." }
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="p-6 rounded-[1.5rem] neo-flat hover:bg-black/[0.01] transition-colors"
                  >
                    <h4 className="font-bold text-gray-800 mb-2">{item.q}</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.a}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <footer className="pt-32 pb-12 border-t border-gray-200/50 mt-12 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex flex-col items-center md:items-start gap-4">
                <Logo className="w-8 h-8" />
                <p className="text-xs text-gray-400 font-medium uppercase tracking-[0.2em]">Building the Future of Campus Life</p>
              </div>
              <div className="flex gap-8">
                <a href="#" className="text-xs font-bold text-gray-400 hover:text-gray-900 uppercase tracking-widest transition-colors">Documentation</a>
                <a href="#" className="text-xs font-bold text-gray-400 hover:text-gray-900 uppercase tracking-widest transition-colors">Security</a>
                <a href="#" className="text-xs font-bold text-gray-400 hover:text-gray-900 uppercase tracking-widest transition-colors">Contact</a>
              </div>
              <p className="text-xs text-gray-400">© 2026 CampusOps Logic. All rights reserved.</p>
            </footer>

          </div>

          {/* Right side: Sticky Form */}
          <div className="lg:col-span-12 xl:col-span-5 h-[calc(100vh-8rem)] sticky top-24 flex items-center py-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="w-full neo-flat rounded-[3rem] p-8 md:p-10 max-h-[90vh] overflow-y-auto scrollbar-hide"
            >
              <div className="flex items-center gap-4 mb-8 p-1 rounded-2xl neo-pressed bg-gray-100/50">
                <button
                  onClick={() => setMode("deploy")}
                  className={`relative z-10 flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${mode === "deploy" ? "text-[#4A6E91]" : "text-gray-400 hover:text-gray-600"}`}
                >
                  {mode === "deploy" && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 bg-white neo-flat rounded-xl -z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}
                  Deploy
                </button>
                <button
                  onClick={() => setMode("manage")}
                  className={`relative z-10 flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${mode === "manage" ? "text-[#85929E]" : "text-gray-400 hover:text-gray-600"}`}
                >
                  {mode === "manage" && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 bg-white neo-flat rounded-xl -z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}
                  Manage
                </button>
              </div>

              <div className="mb-6">
                <motion.h3
                  key={mode}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-bold text-gray-900"
                >
                  {mode === "deploy" ? "Initialize Hub" : "Access Console"}
                </motion.h3>
                <motion.p
                  key={mode + "-desc"}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="text-sm text-gray-500"
                >
                  {mode === "deploy" ? "Fast, secure event provisioning." : "Enter credentials to manage your mission."}
                </motion.p>
              </div>

              <div className="relative overflow-hidden min-h-[440px]">
                <AnimatePresence mode="wait">
                  {mode === "deploy" ? (
                    <motion.form
                      key="deploy-form"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={handleSubmit}
                      className="space-y-5"
                    >
                      {error && (
                        <div className="p-4 bg-red-50/80 border border-red-100 rounded-2xl text-red-600 text-sm font-semibold flex items-center gap-2 animate-shake">
                          <X className="w-4 h-4" />
                          {error}
                        </div>
                      )}

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="title" className="text-[10px] font-bold uppercase tracking-widest text-[#4A6E91]/80 ml-4 flex items-center gap-1.5"><Sparkles className="w-3 h-3" /> Event Identity</Label>
                          <Input id="title" name="title" required placeholder="Spring Tech Mixer 2026" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-4">Description</Label>
                          <Input id="description" name="description" required placeholder="A brief overview of the event..." />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="event_date" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-4 flex items-center gap-1.5"><CalendarDays className="w-3 h-3 text-[#4A6E91]" /> Date</Label>
                            <div className="relative overflow-hidden rounded-[1.5rem] neo-pressed">
                              <Input id="event_date" name="event_date" type="date" required className="bg-transparent border-none shadow-none focus-visible:ring-0 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer" />
                              <CalendarDays className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A6E91] pointer-events-none opacity-50" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="event_time" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-4 flex items-center gap-1.5"><Clock className="w-3 h-3 text-[#85929E]" /> Time</Label>
                            <div className="relative overflow-hidden rounded-[1.5rem] neo-pressed">
                              <Input id="event_time" name="event_time" type="time" required className="bg-transparent border-none shadow-none focus-visible:ring-0 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer" />
                              <Clock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#85929E] pointer-events-none opacity-50" />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="capacity" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-4 flex items-center gap-1.5"><Users className="w-3 h-3 text-[#4A6E91]" /> Capacity</Label>
                            <Input id="capacity" name="capacity" type="number" placeholder="Unlimited" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="location" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-4 flex items-center gap-1.5"><MapPin className="w-3 h-3 text-red-400" /> Location</Label>
                            <Input id="location" name="location" required placeholder="Grand Hall A" />
                          </div>
                        </div>
                      </div>

                      <div className="pt-2">
                        <Button
                          type="submit"
                          size="lg"
                          className="w-full h-14 text-base relative overflow-hidden group shadow-xl active:scale-95 transition-transform bg-[#24292E] hover:bg-[#24292E]/90 text-white rounded-2xl"
                          disabled={loading}
                        >
                          {loading ? (
                            <span className="flex items-center gap-3">
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Provisioning...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              Deploy Event <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </span>
                          )}
                        </Button>
                      </div>
                    </motion.form>
                  ) : (
                    <motion.form
                      key="manage-form"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={handleLogin}
                      className="space-y-6"
                    >
                      {error && (
                        <div className="p-4 bg-red-50/80 border border-red-100 rounded-2xl text-red-600 text-sm font-semibold flex items-center gap-2 animate-shake">
                          <X className="w-4 h-4" />
                          {error}
                        </div>
                      )}

                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="code" className="text-[10px] font-bold uppercase tracking-widest text-[#85929E]/80 ml-4 flex items-center gap-1.5">Access Code</Label>
                          <Input
                            id="code"
                            type="password"
                            value={loginCode}
                            onChange={e => setLoginCode(e.target.value)}
                            required
                            placeholder="ADM-..."
                            className="h-20 text-center tracking-widest font-mono text-2xl"
                          />
                        </div>
                      </div>

                      <div className="pt-4">
                        <Button
                          type="submit"
                          size="lg"
                          className="w-full h-14 text-base relative overflow-hidden group shadow-xl active:scale-95 transition-transform bg-[#24292E] hover:bg-[#24292E]/90 text-white rounded-2xl"
                          disabled={loading}
                        >
                          {loading ? (
                            <span className="flex items-center gap-3">
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Authenticating...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              Enter Command Center <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </span>
                          )}
                        </Button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}

