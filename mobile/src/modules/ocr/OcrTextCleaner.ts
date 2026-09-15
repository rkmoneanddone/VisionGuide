export interface CleanOcrTextResult {
  rawText: string;
  cleanText: string;
  removedLines: string[];
}

const meaningfulValue = /(?:\p{L}{2,}|\d{2,}|₹\s*\d|\d+[.,:/-]\d+|\+?\d[\d\s()-]{5,})/u;
const onlyNoise = /^[\s\p{P}\p{S}_~`|]+$/u;
const repeatedPunctuation = /([!@#$%^&*_=+~`|\\<>])\1{1,}/g;

function normalizeLine(value: string): string {
  return value
    .normalize('NFKC')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(repeatedPunctuation, '$1')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

function shouldKeepLine(line: string): boolean {
  if (!line || onlyNoise.test(line)) return false;
  const letters = (line.match(/\p{L}/gu) ?? []).length;
  const digits = (line.match(/\d/g) ?? []).length;
  const visible = line.replace(/\s/g, '').length;
  if (visible === 0) return false;
  if (letters === 0 && digits === 0) return false;
  if (visible <= 2 && letters + digits <= 1) return false;
  const usefulRatio = (letters + digits) / visible;
  if (usefulRatio < 0.35 && !meaningfulValue.test(line)) return false;
  return true;
}

function isSentenceLike(line: string): boolean {
  const words = line.split(/\s+/).filter(Boolean);
  return words.length >= 3 || /[.!?।:]$/.test(line) || meaningfulValue.test(line);
}

function joinReadableLines(lines: string[]): string {
  const paragraphs: string[] = [];
  let current = '';
  for (const line of lines) {
    if (!current) {
      current = line;
      continue;
    }
    const currentEnds = /[.!?।:]$/.test(current);
    const nextLooksLabel = /^[\p{L}][\p{L}\s]{1,24}:$/u.test(line);
    if (currentEnds || nextLooksLabel) {
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
  let previous = '';

  for (const sourceLine of raw.split(/\r?\n/)) {
    const line = normalizeLine(sourceLine);
    if (!shouldKeepLine(line)) {
      if (line) removedLines.push(line);
      continue;
    }
    if (line.toLocaleLowerCase() === previous.toLocaleLowerCase()) continue;
    if (!isSentenceLike(line) && line.length < 4) {
      removedLines.push(line);
      continue;
    }
    kept.push(line);
    previous = line;
  }

  const cleanText = joinReadableLines(kept).trim();
  return {rawText: raw, cleanText: cleanText || raw, removedLines};
}
