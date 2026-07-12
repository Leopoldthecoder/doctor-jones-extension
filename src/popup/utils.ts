import { fromUrl, parseDomain, ParseResultType } from 'parse-domain'
import browser from 'webextension-polyfill'

type Tab = Awaited<ReturnType<typeof browser.tabs.query>>[number]

let activeTab: Promise<Tab | undefined> | undefined

export const getActiveTab = (): Promise<Tab | undefined> => {
  if (!activeTab) {
    activeTab = browser.tabs
      .query({ active: true, currentWindow: true })
      .then((tabs) => tabs[0])
  }
  return activeTab
}

const parseListed = (value: string) => {
  const result = parseDomain(fromUrl(value))
  return result.type === ParseResultType.Listed ? result : undefined
}

export const isInBlacklist = (blacklist: string[]): boolean => {
  const current = parseListed(location.href)
  if (!current) {
    return false
  }
  return blacklist.some((item) => {
    const parsed = parseListed(item)
    if (!parsed) {
      return false
    }
    const sameSite =
      parsed.domain === current.domain &&
      parsed.topLevelDomains.join('.') === current.topLevelDomains.join('.')
    if (!sameSite) {
      return false
    }
    // A blacklist entry without a subdomain (e.g. "example.com") matches every
    // subdomain of that site; an entry with one must match exactly.
    return (
      parsed.subDomains.length === 0 ||
      parsed.subDomains.join('.') === current.subDomains.join('.')
    )
  })
}

export const convertReversedQuotes = (s: string): string => {
  const counter = { single: 0, double: 0 }
  let ans = ''
  for (const char of s) {
    if (char === '‘' || char === '’') {
      ans += counter.single % 2 === 0 ? '‘' : '’'
      counter.single++
    } else if (char === '“' || char === '”') {
      ans += counter.double % 2 === 0 ? '“' : '”'
      counter.double++
    } else {
      ans += char
    }
  }
  return ans
}
