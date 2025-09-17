// app/api/dashboard/module/[id]/route.ts
import { NextResponse } from "next/server";

const DETAILS: Record<
  string,
  {
    id: string;
    title: string;
    pct: number;
    history: number[]; // longer series for area chart
    weaknesses: string[];
    nextTasks: { id: string; title: string; type: "note" | "mcq" | "scenario" | "past"; estMin: number }[];
  }
> = {
  BT: {
    id: "BT",
    title: "Business & Technology",
    pct: 78,
    history: [55, 58, 60, 63, 66, 69, 71, 73, 74, 76, 78],
    weaknesses: ["A3c Data protection", "A2 Stakeholder analysis"],
    nextTasks: [
      { id: "bt1", title: "Micro-notes A3c (privacy vs security)", type: "note", estMin: 12 },
      { id: "bt2", title: "12 MCQs A3c mixed", type: "mcq", estMin: 18 },
      { id: "bt3", title: "Scenario: governance change request", type: "scenario", estMin: 20 },
      { id: "bt4", title: "Past paper Q: A3c + A2 combo", type: "past", estMin: 25 },
    ],
  },
  MA: {
    id: "MA",
    title: "Management Accounting",
    pct: 63,
    history: [45, 48, 52, 55, 57, 59, 60, 61, 62, 63],
    weaknesses: ["Budgeting variances", "Absorption vs marginal costing"],
    nextTasks: [
      { id: "ma1", title: "Micro-notes: variance formulas", type: "note", estMin: 10 },
      { id: "ma2", title: "10 MCQs costing mix", type: "mcq", estMin: 15 },
      { id: "ma3", title: "Scenario: flexed budget", type: "scenario", estMin: 20 },
    ],
  },
  FA: {
    id: "FA",
    title: "Financial Accounting",
    pct: 54,
    history: [35, 38, 42, 46, 48, 50, 52, 54],
    weaknesses: ["Trial balance adjustments", "Suspense accounts"],
    nextTasks: [
      { id: "fa1", title: "Micro-notes: TB adjustments", type: "note", estMin: 10 },
      { id: "fa2", title: "14 MCQs errors & omissions", type: "mcq", estMin: 20 },
      { id: "fa3", title: "Past paper Q: adjustments set", type: "past", estMin: 25 },
    ],
  },
  LW: {
    id: "LW",
    title: "Corporate & Business Law",
    pct: 41,
    history: [28, 30, 32, 34, 36, 38, 39, 41],
    weaknesses: ["Contract remedies", "Tort negligence basics"],
    nextTasks: [
      { id: "lw1", title: "Micro-notes: remedies breakdown", type: "note", estMin: 10 },
      { id: "lw2", title: "12 MCQs tort vs contract", type: "mcq", estMin: 18 },
      { id: "lw3", title: "Scenario: breach analysis", type: "scenario", estMin: 20 },
    ],
  },
  FR: {
    id: "FR",
    title: "Financial Reporting",
    pct: 35,
    history: [20, 23, 25, 27, 29, 31, 33, 35],
    weaknesses: ["IFRS 15 revenue", "Consolidation basics"],
    nextTasks: [
      { id: "fr1", title: "Micro-notes: IFRS 15 five steps", type: "note", estMin: 12 },
      { id: "fr2", title: "10 MCQs consols basics", type: "mcq", estMin: 16 },
      { id: "fr3", title: "Past paper Q: revenue recognition", type: "past", estMin: 25 },
    ],
  },
};

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const data = DETAILS[params.id.toUpperCase()];
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(data, { status: 200 });
}