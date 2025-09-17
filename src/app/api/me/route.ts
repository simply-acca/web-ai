import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      id: "u_123",
      name: "Priya Kapoor",
      handle: "priyak",
      email: "priya@example.com",
      photo: "/avatars/priya.jpg",   // put a file in public/avatars or use a URL
      plan: "Pro",
      tz: "Europe/Malta",
      notifications: 3,
    },
    { status: 200 }
  );
}