import { defineStore } from 'pinia'

export interface FormatOptions {
  // 通用选项
  autoFormat: boolean
  blacklist: string

  // 格式化选项
  spacing: boolean
  spaceBetweenFullwidthPunctuationAndAlphabets: boolean
  successiveExclamationMarks: boolean
  ellipsisTolerance: string
  replaceWithCornerQuotes: string
  halfwidthParenthesisAroundNumbers: boolean
}

export const createDefaultOptions = (): FormatOptions => ({
  autoFormat: false,
  blacklist: '',
  spacing: true,
  spaceBetweenFullwidthPunctuationAndAlphabets: false,
  successiveExclamationMarks: false,
  ellipsisTolerance: 'none',
  replaceWithCornerQuotes: 'double',
  halfwidthParenthesisAroundNumbers: true,
})

export const useOptionsStore = defineStore('options', {
  state: () => ({ options: createDefaultOptions() }),
  actions: {
    // Merge persisted options over the defaults so newly added option keys keep
    // a sensible value even when the stored object predates them.
    reset(stored: Partial<FormatOptions>) {
      this.options = { ...createDefaultOptions(), ...stored }
    },
    set<K extends keyof FormatOptions>(key: K, value: FormatOptions[K]) {
      this.options[key] = value
    },
  },
})
