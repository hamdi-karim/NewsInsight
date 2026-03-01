export function normalizeSummaryText(value?: string): string | undefined {
  if (!value) return undefined;

  const withoutTags = value.replace(/<[^>]*>/g, ' ');
  const withDecodedEntities = withoutTags
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
  const normalized = withDecodedEntities.replace(/\s+/g, ' ').trim();

  return normalized || undefined;
}
