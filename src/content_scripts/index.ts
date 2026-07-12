import debounce from 'debounce'
import dj from 'doctor-jones'
import browser from 'webextension-polyfill'
import { messageType, type RuntimeMessage } from '../const'
import type { FormatOptions } from '../store/options'
import { convertReversedQuotes, isInBlacklist } from '../popup/utils'

type ElementWithBackup = HTMLElement & { _innerText?: string }
type TextWithBackup = Text & { _nodeValue?: string }

let storedOptions: Partial<FormatOptions> = {}
let textNodes: Node[] = []
let touched = false
let manualRevoked = false
let blacklist: string[] = []
let observer: MutationObserver | undefined

const SKIP_TAGS = ['SCRIPT', 'STYLE', 'META', 'LINK', 'HEAD', 'SVG', 'PATH']

const walk = (nodes: Iterable<Node>) => {
  for (const node of nodes) {
    const el = node as Element
    if (SKIP_TAGS.includes((el.tagName || '').toUpperCase())) {
      continue
    }
    if (el.getAttribute && el.getAttribute('contenteditable')) {
      const activeElement = document.activeElement
      if (activeElement && node.contains(activeElement)) {
        continue
      }
    }
    if (node.hasChildNodes()) {
      walk(node.childNodes)
    } else if (
      node.nodeType === Node.ELEMENT_NODE ||
      node.nodeType === Node.TEXT_NODE
    ) {
      textNodes.push(node)
    }
  }
}

const format = (options?: Partial<FormatOptions>) => {
  touched = true
  textNodes = []
  walk([document.documentElement])
  textNodes.forEach((node) => {
    if (node.hasChildNodes()) {
      return
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as ElementWithBackup
      el._innerText = el._innerText ?? el.innerText
      const formatted = dj(convertReversedQuotes(el.innerText), options)
      if (el.innerText !== formatted) {
        el.innerText = formatted
      }
    } else if (node.nodeType === Node.TEXT_NODE) {
      const text = node as TextWithBackup
      const value = text.nodeValue ?? ''
      text._nodeValue = text._nodeValue ?? value
      const formatted = dj(convertReversedQuotes(value), options)
      if (text.nodeValue !== formatted) {
        text.nodeValue = formatted
      }
    }
  })
}

const revoke = () => {
  if (!touched) {
    return
  }
  touched = false
  textNodes.forEach((node) => {
    if (node.hasChildNodes()) {
      return
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as ElementWithBackup
      if (el._innerText !== undefined) {
        el.innerText = el._innerText
      }
    } else if (node.nodeType === Node.TEXT_NODE) {
      const text = node as TextWithBackup
      if (text._nodeValue !== undefined) {
        text.nodeValue = text._nodeValue
      }
    }
  })
}

const autoFormat = () => {
  if (isInBlacklist(blacklist)) {
    return
  }
  const debouncedFormat = debounce(format, 100, { immediate: true })
  const mutationHandler: MutationCallback = (mutationList) => {
    if (manualRevoked) {
      return
    }
    mutationList.forEach(() => {
      debouncedFormat(storedOptions)
    })
  }
  observer = new MutationObserver(mutationHandler)
  observer.observe(document.body, { childList: true, subtree: true })
  debouncedFormat(storedOptions)
}

void browser.storage.sync.get('FORMAT_OPTIONS').then((result) => {
  const stored = result.FORMAT_OPTIONS as Partial<FormatOptions> | undefined
  if (!stored) {
    return
  }
  storedOptions = stored
  if (stored.blacklist) {
    blacklist = stored.blacklist
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
  }
  if (stored.autoFormat) {
    autoFormat()
  }
})

browser.runtime.onMessage.addListener(
  (request: unknown, sender: browser.Runtime.MessageSender) => {
    if (browser.runtime.id !== sender.id) {
      return
    }
    const message = request as RuntimeMessage
    switch (message.type) {
      case messageType.format:
        format(message.options)
        break
      case messageType.revoke:
        revoke()
        manualRevoked = true
        break
      case messageType.startAutoFormat:
        autoFormat()
        break
      case messageType.stopAutoFormat:
        observer?.disconnect()
        revoke()
        break
      default:
        break
    }
  },
)
