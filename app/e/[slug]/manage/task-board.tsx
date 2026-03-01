"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Task, TaskStatus } from "@prisma/client";

export default function TaskBoard({ slug, initialTasks }: { slug: string, initialTasks: Task[] }) {
    const router = useRouter();
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [title, setTitle] = useState("");
    const [role, setRole] = useState("Logistics");

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        if (!title) return;

        try {
            const res = await fetch(`/api/manage/${slug}/tasks`, {
                method: "POST",
                body: JSON.stringify({ title, role }),
                headers: { "Content-Type": "application/json" }
            });
            const data = await res.json();
            if (res.ok) {
                setTasks([data.task, ...tasks]);
                setTitle("");
                router.refresh();
            }
        } catch (e) { }
    }

    async function updateStatus(id: string, newStatus: TaskStatus) {
        try {
            const res = await fetch(`/api/manage/${slug}/tasks/${id}`, {
                method: "PATCH",
                body: JSON.stringify({ status: newStatus }),
                headers: { "Content-Type": "application/json" }
            });
            if (res.ok) {
                setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
                router.refresh();
            }
        } catch (e) { }
    }

    return (
        <div className="space-y-4">
            <form onSubmit={handleCreate} className="flex gap-2">
                <Input
                    placeholder="New task title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="flex-1"
                />
                <select
                    className="h-12 rounded-[1.5rem] neo-pressed px-4 py-2 text-sm text-gray-800 transition-all focus:outline-none focus:ring-2 focus:ring-[#9D4EDD]/30"
                    value={role}
                    onChange={e => setRole(e.target.value)}
                >
                    <option>Logistics</option>
                    <option>Marketing</option>
                    <option>Registration</option>
                    <option>Speakers</option>
                </select>
                <Button type="submit">Add Task</Button>
            </form>

            <div className="space-y-3 mt-4">
                {tasks.length === 0 && <p className="text-sm text-gray-400 italic">No tasks yet.</p>}
                {tasks.map(task => (
                    <div key={task.id} className="flex items-center justify-between p-4 rounded-2xl neo-flat">
                        <div>
                            <p className={`text-sm font-semibold ${task.status === 'done' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                {task.title}
                            </p>
                            <div className="flex gap-2 mt-1">
                                <Badge variant="outline" className="text-[10px] uppercase border-[#9D4EDD]/20 text-[#9D4EDD]">{task.role}</Badge>
                            </div>
                        </div>

                        <div className="flex gap-1 items-center">
                            <select
                                value={task.status}
                                onChange={(e) => updateStatus(task.id, e.target.value as TaskStatus)}
                                className={`text-xs p-1.5 rounded-lg border-none neo-pressed outline-none ${task.status === 'todo' ? 'text-yellow-700' :
                                    task.status === 'doing' ? 'text-[#00B4D8]' :
                                        'text-[#9D4EDD]'
                                    }`}
                            >
                                <option value="todo">To Do</option>
                                <option value="doing">Doing</option>
                                <option value="done">Done</option>
                            </select>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
