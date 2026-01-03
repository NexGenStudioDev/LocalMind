export const getErrorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message
  try {
    return String(err)
  } catch {
    return 'Unknown error'
  }
}
