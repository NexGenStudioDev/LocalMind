export function safeParse<T>(input: string | undefined | null, fallback: T): T {
  if (!input) return fallback
  try {
    return JSON.parse(input) as T
  } catch (error) {
    // Log the error for diagnostics but avoid throwing to keep services resilient
    console.error('safeParse: failed to parse JSON:', error)
    return fallback
  }
}
