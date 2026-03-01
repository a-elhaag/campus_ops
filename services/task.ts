import prisma from '@/lib/prisma';
import { TaskStatus } from '@prisma/client';

export async function getTasksForEvent(event_id: string) {
    return prisma.task.findMany({
        where: { event_id },
        orderBy: { created_at: 'desc' },
    });
}

export async function createTask(event_id: string, data: { title: string; role: string }) {
    return prisma.task.create({
        data: {
            event_id,
            title: data.title,
            role: data.role,
            status: TaskStatus.todo,
        },
    });
}

export async function updateTaskStatus(task_id: string, status: TaskStatus) {
    return prisma.task.update({
        where: { id: task_id },
        data: { status },
    });
}

export async function updateTask(task_id: string, data: { title?: string; role?: string; status?: TaskStatus }) {
    return prisma.task.update({
        where: { id: task_id },
        data,
    });
}

export async function deleteTask(task_id: string) {
    return prisma.task.delete({
        where: { id: task_id },
    });
}
