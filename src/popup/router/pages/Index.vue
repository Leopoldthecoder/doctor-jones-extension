<template>
  <div class="main">
    <img src="./logo.png" alt="logo" />
    <v-btn color="primary" @click="onFormatClick">{{ formatText }}</v-btn>
    <v-btn color="primary" @click="onRevokeClick">{{ revokeText }}</v-btn>
    <v-btn color="primary" @click="openService">{{ serviceText }}</v-btn>
    <v-btn color="accent" @click="openOptions">{{ optionText }}</v-btn>
    <footer>
      <a
        href="https://github.com/Leopoldthecoder/doctor-jones-extension/issues"
        target="_blank"
        >💡{{ issueText }}</a
      >
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import browser from 'webextension-polyfill'
import { messageType } from '../../../const'
import { useOptionsStore } from '../../../store/options'
import { getActiveTab } from '../../utils'

const router = useRouter()
const store = useOptionsStore()

const i18n = (key: string) => browser.i18n.getMessage(key)
const formatText = i18n('format')
const revokeText = i18n('revoke')
const serviceText = i18n('service')
const optionText = i18n('options')
const issueText = i18n('issues')

const onFormatClick = async () => {
  const tab = await getActiveTab()
  if (tab?.id === undefined) {
    return
  }
  await browser.tabs.sendMessage(tab.id, {
    type: messageType.format,
    options: store.options,
  })
}

const onRevokeClick = async () => {
  const tab = await getActiveTab()
  if (tab?.id === undefined) {
    return
  }
  await browser.tabs.sendMessage(tab.id, { type: messageType.revoke })
}

const openService = () => router.push('/service')
const openOptions = () => router.push('/options')
</script>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.main img {
  height: 100px;
  filter: drop-shadow(0 0 30px #12d3cf);
  margin: 90px 0;
}

.main :deep(.v-btn) {
  color: #fcf9ec;
  width: 200px;
}

.main footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  height: 60px;
  line-height: 60px;
}

.main footer a {
  text-decoration: none;
}
</style>
