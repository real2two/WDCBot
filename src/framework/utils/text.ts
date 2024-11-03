export function convertNamesArrayToText(text: string[]) {
  if (text.length === 1) return text[0];
  return `${text.slice(0, -1).join(', ')} and ${text.slice(-1)}`;
}
