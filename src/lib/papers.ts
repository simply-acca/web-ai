export type PaperId = 'bt' | 'ma' | 'fa' | 'lw'

export const syllabus: Record<PaperId, { title: string; areas: { code: string; title: string }[] }> = {
  bt: {
    title: 'Business and Technology (BT)',
    areas: [
      { code: 'A', title: 'The business organisation and its external environment' },
      { code: 'B', title: 'Business organisational structure, functions and governance' },
      { code: 'C', title: 'Accounting and reporting systems, controls and compliance' },
      { code: 'D', title: 'Leading and managing individuals and teams' },
      { code: 'E', title: 'Personal effectiveness and communication' },
      { code: 'F', title: 'Professional ethics in accounting and business' },
    ],
  },
  ma: { title: 'Management Accounting (MA)', areas: [] },
  fa: { title: 'Financial Accounting (FA)', areas: [] },
  lw: { title: 'Corporate and Business Law (LW)', areas: [] },
}