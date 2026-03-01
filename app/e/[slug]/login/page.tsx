"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
        <main className="flex min-h-screen flex-col items-center justify-center p-4">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Dashboard Login</CardTitle>
                    <CardDescription>Enter the Organizer or Admin code to securely manage this event.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {error && <div className="text-red-500 text-sm font-medium bg-red-50 p-2 rounded text-center">{error}</div>}

                        <div className="space-y-2">
                            <Label htmlFor="code">Access Code</Label>
                            <Input id="code" name="code" type="password" required placeholder="••••••••" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Authenticating..." : "Login"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </main>
    );
}
