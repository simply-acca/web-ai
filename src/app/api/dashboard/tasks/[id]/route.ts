// app/api/dashboard/tasks/[id]/route.ts
import { NextResponse } from "next/server";

type Preview =
  | { kind: "note"; bullets: string[] }
  | { kind: "mcq"; stem: string; options: string[]; answerIndex: number; rationale?: string }
  | { kind: "scenario"; blurb: string; skills: string[] }
  | { kind: "past"; set: string; timing: string; coverage: string };

const DB: Record<string, Preview> = {
  // notes
  t1: { kind: "note", bullets: [
    "Examiner-style definitions with micro-examples",
    "Memory hooks for tricky terms (mnemonics)",
    "End-of-section quick checks to lock it in",
  ]},
  // mcq
  t2: { kind: "mcq",
    stem: "Under IFRS 15, when should revenue be recognised?",
    options: [
      "When cash is received",
      "When control transfers to the customer",
      "When a contract is signed",
      "When performance obligations are identified"
    ],
    answerIndex: 1,
    rationale: "Revenue is recognised when control transfers to the customer."
  },
  // scenario
  t3: { kind: "scenario",
    blurb:
      "A change request impacts data governance and stakeholder reporting. Identify issues, apply relevant rules, and recommend actions.",
    skills: ["Prompt reading", "Issue-spotting", "Structured answers"]
  },
  // past
  t4: { kind: "past",
    set: "Mini-mock (A1/A2/A3 blend)",
    timing: "~25 mins (timed)",
    coverage: "Mixed blueprint coverage • accuracy & pacing"
  },

  // Optional extras for module drilldown tasks (e.g. bt1, ma2 etc.)
  bt1: { kind: "note", bullets: ["Privacy vs security", "Data roles", "Typical pitfalls"] },
  bt2: { kind: "mcq", stem: "Data protection primarily concerns…", options: ["CIA triad", "Personal data processing", "ISMS scope", "Service availability"], answerIndex: 1 },
  bt3: { kind: "scenario", blurb: "Governance change request with competing stakeholder interests.", skills: ["Trade-offs", "Stakeholder mapping"] },
  bt4: { kind: "past", set: "A3c + A2 combo", timing: "~25 mins", coverage: "Governance & stakeholders" },
};

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export async function GET(req: Request, { params }: { params: { id: string }}) {
  const { searchParams } = new URL(req.url);
  if (searchParams.has("slow")) await sleep(Number(searchParams.get("slow")) || 800);
  if (!(params.id in DB)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(DB[params.id], { status: 200, headers: { "Cache-Control": "no-store" } });
}