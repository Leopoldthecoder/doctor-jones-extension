<template>
  <div class="options">
    <h1>
      <v-icon class="back" icon="mdi-arrow-left" @click="navigateBack" />
      {{ i18n('options') }}
    </h1>
    <section class="options-container">
      <section class="options-group">
        <h2 class="options-group-title">{{ i18n('generalOptions') }}</h2>
        <v-switch
          hide-details
          :label="i18n('autoFormat')"
          :model-value="options.autoFormat"
          thumb-color="primary"
          @update:model-value="
            (v) => {
              onChange(v, 'autoFormat')
              onAutoFormatChange(v)
            }
          "
        />
        <template v-if="options.autoFormat">
          <p class="option-label">{{ i18n('blacklist') }}</p>
          <v-textarea
            variant="solo"
            no-resize
            hide-details
            :placeholder="i18n('blacklistPlaceholder')"
            :model-value="options.blacklist"
            @update:model-value="(v) => onChange(v, 'blacklist', false)"
          />
        </template>
      </section>
      <section class="options-group">
        <h2 class="options-group-title">{{ i18n('formatOptions') }}</h2>
        <v-switch
          hide-details
          :label="i18n('spacing')"
          :model-value="options.spacing"
          thumb-color="primary"
          @update:model-value="(v) => onChange(v, 'spacing')"
        />
        <v-switch
          hide-details
          :label="i18n('spaceBetweenFullwidthPunctuationAndAlphabets')"
          :model-value="options.spaceBetweenFullwidthPunctuationAndAlphabets"
          thumb-color="primary"
          @update:model-value="
            (v) => onChange(v, 'spaceBetweenFullwidthPunctuationAndAlphabets')
          "
        />
        <v-switch
          hide-details
          :label="i18n('successiveExclamationMarks')"
          :model-value="options.successiveExclamationMarks"
          thumb-color="primary"
          @update:model-value="(v) => onChange(v, 'successiveExclamationMarks')"
        />
        <v-switch
          hide-details
          :label="i18n('halfwidthParenthesisAroundNumbers')"
          :model-value="options.halfwidthParenthesisAroundNumbers"
          thumb-color="primary"
          @update:model-value="
            (v) => onChange(v, 'halfwidthParenthesisAroundNumbers')
          "
        />
        <v-select
          hide-details
          :label="i18n('ellipsisTolerance')"
          :items="ellipsisOptions"
          :model-value="options.ellipsisTolerance"
          @update:model-value="(v) => onChange(v, 'ellipsisTolerance')"
        />
        <v-select
          hide-details
          :label="i18n('replaceWithCornerQuotes')"
          :items="quotationOptions"
          :model-value="options.replaceWithCornerQuotes"
          @update:model-value="(v) => onChange(v, 'replaceWithCornerQuotes')"
        />
      </section>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import browser from 'webextension-polyfill'
import { messageType } from '../../../const'
import { type FormatOptions, useOptionsStore } from '../../../store/options'
import { getActiveTab } from '../../utils'
import { storeToRefs } from 'pinia'

const router = useRouter()
const store = useOptionsStore()
const { options } = storeToRefs(store)

const i18n = (key: string) => browser.i18n.getMessage(key)

const ellipsisOptions = [
  { title: i18n('ellipsisNone'), value: 'none' },
  { title: i18n('ellipsisDots'), value: '3dots' },
  { title: i18n('ellipsisAll'), value: 'all' },
]

const quotationOptions = [
  { title: i18n('quotationDouble'), value: 'double' },
  { title: i18n('quotationSingle'), value: 'single' },
  { title: i18n('quotationNone'), value: 'none' },
]

const navigateBack = () => router.back()

const onChange = async <K extends keyof FormatOptions>(
  value: unknown,
  key: K,
  convertToBool = true,
) => {
  const next = (
    convertToBool ? value || Boolean(value) : value
  ) as FormatOptions[K]
  store.set(key, next)
  await browser.storage.sync.set({ FORMAT_OPTIONS: { ...store.options } })
}

const onAutoFormatChange = async (value: unknown) => {
  const tab = await getActiveTab()
  if (tab?.id === undefined) {
    return
  }
  await browser.tabs.sendMessage(tab.id, {
    type: value ? messageType.startAutoFormat : messageType.stopAutoFormat,
  })
}
</script>

<style scoped>
.options {
  padding-bottom: 20px;
  height: 600px;
  display: flex;
  flex-direction: column;
}

.options h1 {
  text-align: center;
  margin: 30px 0;
  position: relative;
}

.options .back {
  position: absolute;
  left: 20px;
  top: 2px;
  cursor: pointer;
}

.options-container {
  overflow: auto;
  flex: 1;
}

.options-group {
  margin-bottom: 40px;
}

.options-group-title {
  margin: 0 20px 12px;
}

.option-label {
  padding: 0 20px;
  margin-top: 16px;
  opacity: 0.7;
}

.options :deep(.v-input) {
  padding: 0 20px;
}

.options :deep(.v-select) {
  margin-top: 20px;
}
</style>
