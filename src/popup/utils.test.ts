import { afterEach, describe, expect, it, vi } from 'vitest'
import { convertReversedQuotes, isInBlacklist } from './utils'

// webextension-polyfill throws at import time when there is no extension
// runtime; the helpers under test never touch `browser`, so a stub is enough.
vi.mock('webextension-polyfill', () => ({ default: {} }))

const setLocation = (href: string) => {
  vi.stubGlobal('location', { href })
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('isInBlacklist', () => {
  it('matches a bare domain against any subdomain', () => {
    setLocation('https://www.example.com/some/page')
    expect(isInBlacklist(['example.com'])).toBe(true)
  })

  it('matches an exact subdomain entry', () => {
    setLocation('https://www.example.com/')
    expect(isInBlacklist(['www.example.com'])).toBe(true)
  })

  it('does not match a different subdomain', () => {
    setLocation('https://www.example.com/')
    expect(isInBlacklist(['foo.example.com'])).toBe(false)
  })

  it('does not match an unrelated site', () => {
    setLocation('https://www.example.com/')
    expect(isInBlacklist(['another.org'])).toBe(false)
  })

  it('returns false for an empty blacklist', () => {
    setLocation('https://www.example.com/')
    expect(isInBlacklist([])).toBe(false)
  })
})

describe('convertReversedQuotes', () => {
  it('alternates double quotes open/close', () => {
    expect(convertReversedQuotes('”a”b”')).toBe('“a”b“')
  })

  it('normalizes reversed single quotes', () => {
    expect(convertReversedQuotes('’x‘')).toBe('‘x’')
  })

  it('leaves non-quote characters untouched', () => {
    expect(convertReversedQuotes('hello 世界')).toBe('hello 世界')
  })
})
