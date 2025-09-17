import { NextResponse } from "next/server";

export async function GET() {
  const papers = [
    { id: "bt-2023-jun", code: "BT", title: "BT — June 2023", durationMin: 120, questions: 20 },
    { id: "bt-2023-dec", code: "BT", title: "BT — December 2023", durationMin: 120, questions: 20 },
  ];
  return NextResponse.json({ papers });
}