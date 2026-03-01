"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Task, TaskStatus, TaskRole } from "@prisma/client";
import { Plus, X, Trash2, CheckCircle2, Circle, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TaskBoard({ slug, initialTasks }: { slug: string, initialTasks: Task[] }) {
    const router = useRouter();
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [title, setTitle] = useState("");
    const [role, setRole] = useState<TaskRole>(TaskRole.Logistics);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

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
                setIsModalOpen(false);
                router.refresh();
            }
        } catch (e) { }
    }

    async function updateStatus(id: string, newStatus: TaskStatus) {
        try {
            // Optimistic update
            const oldTasks = [...tasks];
            setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));

            const res = await fetch(`/api/manage/${slug}/tasks/${id}`, {
                method: "PATCH",
                body: JSON.stringify({ status: newStatus }),
                headers: { "Content-Type": "application/json" }
            });

            if (res.ok) {
                router.refresh();
            } else {
                setTasks(oldTasks); // Revert
            }
        } catch (e) { }
    }

    async function handleDelete(id: string) {
        setIsDeleting(id);
        const oldTasks = [...tasks];
        // Optimistic delete
        setTasks(tasks.filter(t => t.id !== id));

        try {
            const res = await fetch(`/api/manage/${slug}/tasks/${id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                router.refresh();
            } else {
                setTasks(oldTasks); // Revert
            }
        } catch (e) {
            setTasks(oldTasks);
        } finally {
            setIsDeleting(null);
        }
    }

    const statuses = [
        { value: 'todo', label: 'To Do', icon: Circle, color: 'text-slate-400' },
        { value: 'doing', label: 'In Progress', icon: Clock, color: 'text-[#85929E]' },
        { value: 'done', label: 'Completed', icon: CheckCircle2, color: 'text-[#4A6E91]' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    Active Operations <Badge className="rounded-full bg-[#4A6E91]/10 text-[#4A6E91] border-none">{tasks.length}</Badge>
                </h3>

                <motion.button
                    layoutId="task-modal"
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex h-9 items-center justify-center rounded-full bg-[#24292E] px-6 text-sm font-medium text-white shadow-lg transition-colors hover:bg-[#24292E]/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 gap-2"
                >
                    <motion.div layoutId="task-modal-icon">
                        <Plus className="w-4 h-4" />
                    </motion.div>
                    <motion.span layoutId="task-modal-text">New Task</motion.span>
                </motion.button>
            </div>

            <div className="space-y-4">
                {tasks.length === 0 && (
                    <div className="p-12 text-center rounded-[2rem] neo-pressed border-2 border-dashed border-gray-200">
                        <p className="text-gray-400 italic">No tasks active in this sector.</p>
                    </div>
                )}

                <AnimatePresence mode="popLayout">
                    {tasks.map(task => (
                        <motion.div
                            key={task.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            className="flex items-center justify-between p-5 rounded-[1.5rem] neo-flat group hover:bg-black/[0.02] transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-xl neo-pressed ${task.status === 'done' ? 'text-[#4A6E91]' : 'text-gray-400'}`}>
                                    {task.status === 'done' ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                                </div>
                                <div>
                                    <p className={`font-bold transition-all ${task.status === 'done' ? 'line-through text-gray-400 font-medium' : 'text-gray-800'}`}>
                                        {task.title}
                                    </p>
                                    <div className="flex gap-2 mt-1">
                                        <Badge variant="outline" className="text-[10px] font-bold uppercase border-gray-200 text-gray-500">{task.role}</Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 items-center">
                                <div className="flex items-center gap-2 p-1 rounded-xl neo-pressed bg-white/50">
                                    {statuses.map((s) => (
                                        <button
                                            key={s.value}
                                            onClick={() => updateStatus(task.id, s.value as TaskStatus)}
                                            title={s.label}
                                            className={`p-1.5 rounded-lg transition-all ${task.status === s.value
                                                ? `bg-white shadow-sm scale-110 ${s.color}`
                                                : "text-gray-300 hover:text-gray-500"}`}
                                        >
                                            <s.icon className="w-4 h-4" />
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => handleDelete(task.id)}
                                    disabled={isDeleting === task.id}
                                    className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-white/60 backdrop-blur-md"
                            onClick={() => setIsModalOpen(false)}
                        />
                        <motion.div
                            layoutId="task-modal"
                            className="relative w-full max-w-md p-8 rounded-[2.5rem] bg-white shadow-2xl overflow-hidden border border-gray-100"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <motion.h3 layoutId="task-modal-text" className="text-2xl font-bold text-gray-800">New Task</motion.h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 rounded-xl neo-pressed text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleCreate} className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="ml-2 text-xs font-bold uppercase tracking-widest text-gray-400">Operation Name</Label>
                                    <Input
                                        placeholder="Target objective..."
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        autoFocus
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="ml-2 text-xs font-bold uppercase tracking-widest text-gray-400">Assign Sector</Label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {Object.values(TaskRole).map((r) => (
                                            <button
                                                key={r as string}
                                                type="button"
                                                onClick={() => setRole(r as TaskRole)}
                                                className={`px-4 py-3 rounded-xl text-xs font-bold transition-all ${role === r
                                                    ? "neo-pressed text-[#4A6E91]"
                                                    : "neo-flat text-gray-500"}`}
                                            >
                                                {r as string}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        className="w-full inline-flex h-12 items-center justify-center rounded-2xl bg-[#24292E] px-8 text-sm font-medium text-white shadow transition-colors hover:bg-[#24292E]/90"
                                    >
                                        Authorize Task
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
