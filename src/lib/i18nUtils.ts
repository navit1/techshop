
// This function provides the core logic for selecting the correct plural form.
// It's based on common Slavic language pluralization rules but might need adjustment
// for perfect Kazakh pluralization if its rules are significantly different.
// For English, a simpler rule (one vs. other) is usually sufficient.
export function getPluralNoun(count: number, one: string, few: string, many: string): string {
  const n = Math.abs(count) % 100;
  const n1 = n % 10;

  // Special handling for English-like pluralization if few/many are the same
  if (few === many) {
    return count === 1 ? one : many;
  }

  // Russian/Slavic-like pluralization
  if (n > 10 && n < 20) return many;
  if (n1 > 1 && n1 < 5) return few;
  if (n1 === 1) return one;
  return many;
}

// Specific noun getter functions are removed from here.
// Components will now use `useLanguage().translate` with keys like 'noun.product'
// and pass the 'count' parameter for the provider to handle pluralization.
// The `getPluralNoun` function can still be used directly in components if more complex
// pluralization logic is needed outside of the simple `translate('noun.key', { count: x })` pattern.
// For example, if a language has more than 3 plural forms or very irregular rules not covered
// by the 'one', 'few', 'many' structure in the dictionaries.
