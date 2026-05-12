import type { AIHeartBoardCategory } from "@/lib/ai/heartBoardSchema";

function skipWS(s: string, i: number): number {
  let p = i;
  while (p < s.length && (s[p] === " " || s[p] === "\n" || s[p] === "\r" || s[p] === "\t")) p++;
  return p;
}

function parseBalancedObject(s: string, start: number): { end: number; json: string } | null {
  if (s[start] !== "{") return null;
  let depth = 0;
  let inString = false;
  let escape = false;
  for (let p = start; p < s.length; p++) {
    const c = s[p];
    if (escape) {
      escape = false;
      continue;
    }
    if (inString) {
      if (c === "\\") escape = true;
      else if (c === '"') inString = false;
      continue;
    }
    if (c === '"') {
      inString = true;
      continue;
    }
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) return { end: p + 1, json: s.slice(start, p + 1) };
    }
  }
  return null;
}

export function extractCompleteCategoryObjects(buffer: string): AIHeartBoardCategory[] {
  const needle = '"categories"';
  const idx = buffer.indexOf(needle);
  if (idx < 0) return [];
  let i = idx + needle.length;
  i = skipWS(buffer, i);
  if (buffer[i] !== ":") return [];
  i = skipWS(buffer, i + 1);
  if (buffer[i] !== "[") return [];
  i++;
  const out: AIHeartBoardCategory[] = [];
  while (true) {
    i = skipWS(buffer, i);
    if (i >= buffer.length) break;
    if (buffer[i] === "]") break;
    if (buffer[i] === ",") {
      i++;
      continue;
    }
    const parsed = parseBalancedObject(buffer, i);
    if (!parsed) break;
    try {
      out.push(JSON.parse(parsed.json) as AIHeartBoardCategory);
    } catch {
      /* 未完成片段 */
    }
    i = parsed.end;
  }
  return out;
}

export function appendStreamText(accumulated: string, piece: string): string {
  if (!piece) return accumulated;
  if (accumulated.length > 0 && piece.startsWith(accumulated)) return piece;
  return accumulated + piece;
}
