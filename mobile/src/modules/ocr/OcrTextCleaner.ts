export interface CleanOcrTextResult {
  rawText: string;
  cleanText: string;
  removedLines: string[];
}

const meaningfulValue = /(?:\p{L}{2,}|₹\s*\d|\d+[.,:/-]\d+|\+?\d[\d\s()-]{5,})/u;
const onlyNoise = /^[\s\p{P}\p{S}_~`|]+$/u;
const repeatedPunctuation = /([!@#$%^&*_=+~`|\\<>])\1{1,}/g;
const machineCode = /^(?=.*\d)(?=.*[A-Za-z])[A-Za-z0-9_./()-]{12,}$/;
const longNumber = /^\d[\d\s-]{9,}$/;
const lowValueLabels = /^(?:scan me|register your warranty|warranty registration|electronic e-?waste|registration certificate|certificate number|ep[rw]|barcode|qr code)\b/i;

function normalizeLine(value: string): string {
  return value
    .normalize('NFKC')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(repeatedPunctuation, '$1')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

function shouldKeepLine(line: string): boolean {
  if (!line || onlyNoise.test(line) || lowValueLabels.test(line)) return false;
  if (machineCode.test(line.replace(/\s/g, '')) || longNumber.test(line)) return false;
  const letters = (line.match(/\p{L}/gu) ?? []).length;
  const digits = (line.match(/\d/g) ?? []).length;
  const visible = line.replace(/\s/g, '').length;
  if (!visible || (letters === 0 && digits === 0)) return false;
  if (visible <= 2 && letters + digits <= 1) return false;
  const usefulRatio = (letters + digits) / visible;
  return usefulRatio >= 0.42 || meaningfulValue.test(line);
}

function isContactOrValue(line: string): boolean {
  return /(?:₹|mrp|price|date|month|year|model|brand|colour|color|weight|size|country|origin|support|contact|email|visit|www\.|@|\+\d|contents?|contains?|imported by|manufactur)/i.test(line);
}

function joinReadableLines(lines: string[]): string {
  const paragraphs: string[] = [];
  let current = '';
  for (const line of lines) {
    if (!current) { current = line; continue; }
    if (/[.!?।:]$/.test(current) || isContactOrValue(line)) {
      paragraphs.push(current);
      current = line;
    } else {
      current += ` ${line}`;
    }
  }
  if (current) paragraphs.push(current);
  return paragraphs.join('\n\n');
}

export function cleanOcrText(rawText: string): CleanOcrTextResult {
  const raw = rawText.trim();
  if (!raw) return {rawText: '', cleanText: '', removedLines: []};
  const removedLines: string[] = [];
  const kept: string[] = [];
  const seen = new Set<string>();

  for (const sourceLine of raw.split(/\r?\n/)) {
    const line = normalizeLine(sourceLine);
    const key = line.toLocaleLowerCase();
    if (!shouldKeepLine(line) || seen.has(key)) {
      if (line && !seen.has(key)) removedLines.push(line);
      continue;
    }
    const words = line.split(/\s+/).filter(Boolean);
    if (words.length === 1 && line.length < 4 && !isContactOrValue(line)) {
      removedLines.push(line);
      continue;
    }
    seen.add(key);
    kept.push(line);
  }

  const cleanText = joinReadableLines(kept).trim();
  return {rawText: raw, cleanText: cleanText || raw, removedLines};
}
