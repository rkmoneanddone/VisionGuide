export type ScanModeId =
  | 'anything'
  | 'electricity_bill'
  | 'newspaper'
  | 'school_book'
  | 'notebook'
  | 'letter';

export interface ScanMode {
  id: ScanModeId;
  title: string;
  description: string;
  icon: string;
  processor: 'general' | 'bill' | 'article' | 'education' | 'notes' | 'letter';
  aiOptional: boolean;
}

export const SCAN_MODES: readonly ScanMode[] = [
  {
    id: 'anything',
    title: 'Scan Anything',
    description: 'Point, scan and hear any printed text.',
    icon: 'scan',
    processor: 'general',
    aiOptional: true,
  },
  {
    id: 'electricity_bill',
    title: 'Electricity Bill',
    description: 'Read bill amount, due date and important details.',
    icon: 'receipt',
    processor: 'bill',
    aiOptional: true,
  },
  {
    id: 'newspaper',
    title: 'Newspaper',
    description: 'Read headlines and articles in a natural order.',
    icon: 'newspaper',
    processor: 'article',
    aiOptional: true,
  },
  {
    id: 'school_book',
    title: 'School Book',
    description: 'Read lessons and optionally explain difficult text.',
    icon: 'book-open',
    processor: 'education',
    aiOptional: true,
  },
  {
    id: 'notebook',
    title: 'Notebook / Copy',
    description: 'Read photographed notes and supported handwriting.',
    icon: 'notebook',
    processor: 'notes',
    aiOptional: true,
  },
  {
    id: 'letter',
    title: 'Letter',
    description: 'Read a personal or official letter in sequence.',
    icon: 'mail',
    processor: 'letter',
    aiOptional: true,
  },
] as const;

export function getScanMode(id: ScanModeId): ScanMode {
  return SCAN_MODES.find(mode => mode.id === id) ?? SCAN_MODES[0];
}
