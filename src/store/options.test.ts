import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { createDefaultOptions, useOptionsStore } from './options'

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('options store', () => {
  it('starts from the defaults', () => {
    const store = useOptionsStore()
    expect(store.options).toEqual(createDefaultOptions())
  })

  it('merges persisted options over the defaults on reset', () => {
    const store = useOptionsStore()
    store.reset({ spacing: false, autoFormat: true })
    expect(store.options.spacing).toBe(false)
    expect(store.options.autoFormat).toBe(true)
    // A key absent from the persisted payload keeps its default.
    expect(store.options.replaceWithCornerQuotes).toBe('double')
  })

  it('updates a single key with set', () => {
    const store = useOptionsStore()
    store.set('ellipsisTolerance', 'all')
    expect(store.options.ellipsisTolerance).toBe('all')
  })
})
