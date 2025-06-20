
// This file's getPluralNoun function is now effectively superseded by the
// identical function co-located within LanguageProvider.tsx.
// Components should rely on the `translate` function from `useLanguage`
// which handles pluralization internally using its own getPluralNoun.

// To avoid confusion and ensure components use the centralized translation mechanism,
// the direct export of getPluralNoun from this file can be removed or the file
// can be deprecated if no other unique utilities remain.

// For now, leaving it as-is but noting its redundancy with LanguageProvider's internal helper.
// No active code from here should be directly imported by components for pluralization.

export function getPluralNoun(count: number, one: string, few: string, many: string): string {
  const n = Math.abs(count) % 100;
  const n1 = n % 10;

  if (few === many) {
    return count === 1 ? one : many;
  }

  if (n > 10 && n < 20) return many;
  if (n1 > 1 && n1 < 5) return few;
  if (n1 === 1) return one;
  return many;
}
