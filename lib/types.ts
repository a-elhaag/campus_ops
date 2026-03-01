// Custom type definitions for database models
// Generated from Prisma schema

export type Event = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: EventCategory;
  starts_at: Date;
  location: string;
  capacity?: number | null;
  admin_code: string;
  organizer_code: string;
  created_at: Date;
  updated_at: Date;
  _count?: {
    rsvps: number;
    tasks: number;
  };
};

export type Task = {
  id: string;
  event_id: string;
  title: string;
  role: TaskRole;
  status: TaskStatus;
  created_at: Date;
  updated_at: Date;
};

export type RSVP = {
  id: string;
  event_id: string;
  name: string;
  contact?: string | null;
  checked_in: boolean;
  created_at: Date;
  updated_at: Date;
};

// Enum types
export type EventCategory =
  | "General"
  | "Academic"
  | "Social"
  | "Sports"
  | "Cultural"
  | "Workshop"
  | "Competition";

export type TaskRole =
  | "Logistics"
  | "Marketing"
  | "Speakers"
  | "Registration"
  | "Catering"
  | "Technical";

export type TaskStatus = "todo" | "doing" | "done";

// Enum values for runtime
export const EventCategoryValues = {
  General: "General",
  Academic: "Academic",
  Social: "Social",
  Sports: "Sports",
  Cultural: "Cultural",
  Workshop: "Workshop",
  Competition: "Competition",
} as const;

export const TaskRoleValues = {
  Logistics: "Logistics",
  Marketing: "Marketing",
  Speakers: "Speakers",
  Registration: "Registration",
  Catering: "Catering",
  Technical: "Technical",
} as const;

export const TaskStatusValues = {
  todo: "todo",
  doing: "doing",
  done: "done",
} as const;
