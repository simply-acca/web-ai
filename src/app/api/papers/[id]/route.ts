import { NextResponse } from "next/server";

type Q = {
  id: string;
  type: "mcq" | "multi" | "scenario";
  stem: string;
  options?: { id: string; text: string }[];
  correct?: string[];
  marks?: number;
  explanation?: string;
};

const BANK: Record<string, { id: string; title: string; code: string; durationMin: number; questions: Q[] }> = {
  "bt-2023-jun": {
    id: "bt-2023-jun",
    title: "BT — June 2023",
    code: "BT",
    durationMin: 120,
    questions: [
      {
        id: "q1",
        type: "mcq",
        stem: "Which stakeholder is typically <b>internal</b> to an organisation?",
        options: [
          { id: "a", text: "Shareholders" },
          { id: "b", text: "Suppliers" },
          { id: "c", text: "Employees" },
          { id: "d", text: "Government" },
        ],
        correct: ["c"],
        marks: 2,
        explanation: "Employees are internal stakeholders. Others listed are external.",
      },
      {
        id: "q2",
        type: "multi",
        stem: "Select ALL that relate to data protection under A3c:",
        options: [
          { id: "a", text: "Lawful processing" },
          { id: "b", text: "Data minimisation" },
          { id: "c", text: "Going concern" },
          { id: "d", text: "Purpose limitation" },
        ],
        correct: ["a", "b", "d"],
        marks: 3,
        explanation: "A3c covers lawful processing, minimisation, purpose limitation. 'Going concern' is FR.",
      },
      {
        id: "q3",
        type: "scenario",
        stem:
          "ACME Ltd handles personal data of EU customers. A manager requests the full dataset to be sent by email to a supplier for a time-critical task. " +
          "Briefly outline <b>two</b> concerns and <b>one</b> action you would recommend.",
        marks: 5,
        explanation: "Concerns: unlawful disclosure, lack of safeguards, no DPA. Action: assess lawful basis, DPA, use secure transfer.",
      },
    ],
  },
  "bt-2023-dec": {
    id: "bt-2023-dec",
    title: "BT — December 2023",
    code: "BT",
    durationMin: 120,
    questions: [
      {
        id: "q1",
        type: "mcq",
        stem: "Corporate governance primarily aims to:",
        options: [
          { id: "a", text: "Maximise short-term profits" },
          { id: "b", text: "Increase market share at any cost" },
          { id: "c", text: "Align management with stakeholder interests" },
          { id: "d", text: "Reduce audit fees" },
        ],
        correct: ["c"],
        marks: 2,
        explanation: "Governance ensures accountability and alignment with stakeholder interests.",
      },
    ],
  },
};

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const paper = BANK[params.id];
  if (!paper) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(paper);
}