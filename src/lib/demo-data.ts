export const DEMO_USERS = {
  student: {
    email: "student@demo.com",
    password: "password123",
    role: "student" as const,
    name: "John Doe",
    level: 5,
    xp: 1240,
    nextLevelXp: 2000,
    streak: 12,
  },
  teacher: {
    email: "teacher@demo.com",
    password: "password123",
    role: "teacher" as const,
    name: "Prof. Sarah Smith",
    avatar: "SS",
  },
  admin: {
    email: "admin@demo.com",
    password: "password123",
    role: "admin" as const,
    name: "System Admin",
    avatar: "AD",
  },
};