// lib/auth-server.ts
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export type Role = "admin" | "student" | "teacher";

export async function getServerAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    // Verify the JWT to ensure it's not faked
    const { payload } = await jwtVerify(token, secret);
    
    return {
      role: payload.role as Role,
      userId: payload.sub,
      email: payload.email,
    };
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null; // Token invalid or expired
  }
}