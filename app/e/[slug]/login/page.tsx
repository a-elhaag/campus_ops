"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, AlertCircle, CheckCircle2 } from "lucide-react";

export default function LoginPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { slug } = use(params);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const code = formData.get("code") as string;

    if (!code || code.trim().length === 0) {
      setError("Access code is required");
      return;
    }

    if (code.length < 6) {
      setError("Access code should be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, code: code.trim() }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Invalid code. Please check and try again.");
      }

      router.push(`/e/${slug}/manage`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-4 bg-[#F1F4F9] dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800">
      {/* Background elements for visual depth */}
      <div className="fixed -top-40 -left-40 w-[500px] h-[500px] bg-[#4A6E91]/05 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 pointer-events-none dark:opacity-20"></div>
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-[#85929E]/05 rounded-full mix-blend-multiply filter blur-[120px] opacity-60 pointer-events-none dark:opacity-15"></div>

      <div className="w-full max-w-md relative z-10">
        <Card className="neo-flat dark:bg-gray-800/50 rounded-[2.5rem] border-gray-200 dark:border-gray-700">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-2xl neo-pressed dark:bg-gray-700 flex items-center justify-center">
                <Lock className="w-8 h-8 text-[#4A6E91] dark:text-[#B074ED]" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">
              Dashboard Access
            </CardTitle>
            <CardDescription className="text-base mt-3">
              Enter your Admin or Organizer code to manage this event
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {error && (
                <div className="animate-slideUp p-4 bg-red-50 dark:bg-red-900/20 border border-red-200/50 dark:border-red-200/10 text-red-900 dark:text-red-100 rounded-2xl text-sm font-semibold space-y-2">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                  <p className="text-xs text-red-800 dark:text-red-200 ml-8">
                    Check that you've entered the code correctly, or contact the event organizer.
                  </p>
                </div>
              )}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-1 ml-2">
                  <Label
                    htmlFor="code"
                    className="text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300"
                  >
                    Access Code
                  </Label>
                  <span className="text-red-500">*</span>
                </div>
                <Input
                  id="code"
                  name="code"
                  type="password"
                  required
                  placeholder="••••••••"
                  autoFocus
                  className={`h-12 rounded-xl text-base border-2 transition-colors dark:bg-gray-700/50 dark:text-gray-100 dark:placeholder-gray-400 font-mono tracking-widest ${
                    error
                      ? "border-red-500 dark:border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  You received this code when the event was created
                </p>
              </div>
            </CardContent>
            <CardFooter className="pt-8">
              <Button
                type="submit"
                size="lg"
                className="w-full uppercase tracking-widest text-base"
                disabled={loading}
                isLoading={loading}
              >
                Login
              </Button>
            </CardFooter>
          </form>
        </Card>

        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-8 px-4">
          🔐 Your code is secure and encrypted. Never shared publicly.
        </p>
      </div>
    </main>
  );
}
