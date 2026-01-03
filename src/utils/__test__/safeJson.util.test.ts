import { safeParse } from '../safeJson.util'

describe('safeParse', () => {
  test('parses valid JSON', () => {
    const input = '{"a": 1}'
    const res = safeParse(input, {})
    expect(res).toEqual({ a: 1 })
  })

  test('returns fallback for invalid JSON', () => {
    const input = '{invalid json}'
    const fallback = { foo: 'bar' }
    const res = safeParse(input, fallback)
    expect(res).toBe(fallback)
  })

  test('returns fallback for undefined input', () => {
    const res = safeParse(undefined, 'fallback')
    expect(res).toBe('fallback')
  })
})
