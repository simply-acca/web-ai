// app/api/dashboard/mock/route.ts
import { NextResponse } from "next/server";

const MOCK = {
  user: { name: "Alex", exam: "BT", daysUntil: 42, passProb: 0.68, xp: 2450 },
  today: {
    estimatedMinutes: 110,
    tasks: [
      { id: "t1", title: "Read notes: A-3c", duration: 15, tag: "note", detail: "Read micro-notes on A3c." },
      { id: "t2", title: "10 MCQs: A-3c", duration: 20, tag: "mcq", detail: "Medium difficulty MCQs on A3c." },
      { id: "t3", title: "Scenario task — A-3c", duration: 30, tag: "scenario", detail: "Timed scenario practice." },
      { id: "t4", title: "2 Past Paper Qs A1a", duration: 25, tag: "past", detail: "2 past-paper questions." }
    ]
  },
  modules: [
    { id: "BT", title: "Business & Technology", pct: 78, band: "Core", history: [60, 66, 71, 74, 78] },
    { id: "MA", title: "Management Accounting", pct: 63, band: "Core", history: [52, 56, 60, 61, 63] },
    { id: "FA", title: "Financial Accounting", pct: 54, band: "Core", history: [40, 46, 49, 52, 54] },
    { id: "LW", title: "Corporate & Business Law", pct: 41, band: "Applied", history: [32, 35, 37, 39, 41] },
    { id: "FR", title: "Financial Reporting", pct: 35, band: "Applied", history: [25, 28, 31, 33, 35] },
  ],
  revision: [
    { label: "Strongest Area", value: "A1 Business organization (95%)" },
    { label: "Weakest Area", value: "A3c Data Protection (42%)" },
    { label: "Common error", value: "Mixing internal vs connected stakeholders" }
  ],
  insights: { streak: 7, zday: 2450 }
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  // ✅ Simulate network latency: /api/dashboard/mock?slow=1
  if (searchParams.has("slow")) {
    const ms = Number(searchParams.get("slow")) || 2000; // default 2s
    await new Promise((r) => setTimeout(r, ms));
  }

  // ✅ Force an error: /api/dashboard/mock?fail=1
  if (searchParams.has("fail")) {
    return NextResponse.json({ error: "Forced failure" }, { status: 500 });
  }

  return NextResponse.json(MOCK, { status: 200 });
}