"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";

export default function LoginPage({ params }: { params: Promise<{ slug: string }> }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { slug } = use(params);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(`/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slug, code: data.code })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Login failed");
            }

            router.push(`/e/${slug}/manage`);
            router.refresh();
        } catch (err: any) {
            setError(err.message);
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
                        <CardTitle className="text-3xl font-bold">Dashboard Access</CardTitle>
                        <CardDescription className="text-base mt-3">
                            Enter your Admin or Organizer code to manage this event
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-6">
                            {error && (
                                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200/50 dark:border-red-200/10 text-red-900 dark:text-red-100 rounded-2xl text-sm font-semibold">
                                    <p className="flex items-center gap-2">
                                        <span>⚠️</span>
                                        {error}
                                    </p>
                                </div>
                            )}

                            <div className="space-y-3">
                                <Label htmlFor="code" className="text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 ml-2">
                                    Access Code
                                </Label>
                                <Input 
                                    id="code" 
                                    name="code" 
                                    type="password" 
                                    required 
                                    placeholder="••••••••"
                                    autoFocus
                                    className="h-12 rounded-xl text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700/50 dark:text-gray-100 dark:placeholder-gray-400 font-mono tracking-widest"
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                    You received this code when the event was created
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter className="pt-8">
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full neo-vibrant h-12 rounded-2xl text-base font-bold uppercase tracking-widest disabled:opacity-50 transition-all"
                            >
                                {loading ? "Authenticating..." : "Login"}
                            </button>
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
