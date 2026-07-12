<template>
  <div class="popup">
    <v-app>
      <router-view />
    </v-app>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import browser from 'webextension-polyfill'
import { type FormatOptions, useOptionsStore } from '../store/options'

const store = useOptionsStore()

onMounted(async () => {
  const result = await browser.storage.sync.get('FORMAT_OPTIONS')
  const stored = result.FORMAT_OPTIONS as Partial<FormatOptions> | undefined
  if (stored) {
    store.reset(stored)
  }
})
</script>

<style scoped>
.popup {
  width: 400px;
  height: 600px;
  text-shadow: 0 0 10px #12d3cf;
}
</style>
