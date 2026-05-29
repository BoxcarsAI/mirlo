import { getLanguageInfo } from "@/utils/languages";

export function getLanguageName(code: string): string {
  const info = getLanguageInfo(code);
  if (info) {
    return info.english;
  }
  return code ? code.toUpperCase() : "";
}

export function getWordCount(text: string): number {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}
