
export function getPluralNoun(count: number, one: string, few: string, many: string): string {
  const n = Math.abs(count) % 100;
  const n1 = n % 10;
  if (n > 10 && n < 20) return many;
  if (n1 > 1 && n1 < 5) return few;
  if (n1 === 1) return one;
  return many;
}

export function getProductNoun(count: number): string {
  return getPluralNoun(count, "товар", "товара", "товаров");
}

export function getReviewNoun(count: number): string {
  return getPluralNoun(count, "отзыв", "отзыва", "отзывов");
}

export function getItemNoun(count: number): string {
  // For cart items, "товар" or "позиция" can be used. "товар" is consistent.
  return getPluralNoun(count, "товар", "товара", "товаров");
}
