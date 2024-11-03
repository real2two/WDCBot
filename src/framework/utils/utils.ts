export function convertNamesArrayToText(text: string[]) {
  if (text.length === 1) return text[0];
  return `${text.slice(0, -1).join(', ')} and ${text.slice(-1)}`;
}

export function sortGroupByOrder<V extends V[0][]>(
  values: V,
  keySelector: (value: V[0]) => number,
) {
  return Object.entries(Object.groupBy(values, keySelector))
    .map((v) => [Number(v[0]), v[1]])
    .sort((a, b) => (a[0] as number) - (b[0] as number)) as [number, V[0][]][];
}
