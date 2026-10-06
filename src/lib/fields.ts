/** Sanity `post.field` may be a legacy string or a string[]. */
export function normalizeFields(
  field: string | string[] | null | undefined,
): string[] {
  if (Array.isArray(field)) {
    return field.map((item) => item?.trim()).filter((item): item is string => Boolean(item))
  }
  if (typeof field === "string" && field.trim()) return [field.trim()]
  return []
}

export function formatFields(field: string | string[] | null | undefined): string {
  return normalizeFields(field).join(", ")
}

/** First label drives the study sidebar series. */
export function primaryField(field: string | string[] | null | undefined): string | null {
  return normalizeFields(field)[0] ?? null
}
