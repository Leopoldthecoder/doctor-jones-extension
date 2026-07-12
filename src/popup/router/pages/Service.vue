<template>
  <div class="service">
    <h1>
      <v-icon class="back" icon="mdi-arrow-left" @click="navigateBack" />
      {{ i18n('service') }}
    </h1>
    <section class="service-container">
      <label class="service-label">{{ i18n('serviceInputLabel') }}</label>
      <v-textarea
        variant="solo"
        hide-details
        :placeholder="i18n('serviceInputPlaceholder')"
        @update:model-value="onInput"
      />
      <label class="service-label">{{ i18n('serviceOutputLabel') }}</label>
      <v-textarea
        variant="solo"
        readonly
        hide-details
        :placeholder="i18n('serviceOutputPlaceholder')"
        :model-value="formattedText"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import browser from 'webextension-polyfill'
import dj from 'doctor-jones'
import { useOptionsStore } from '../../../store/options'

const router = useRouter()
const store = useOptionsStore()

const i18n = (key: string) => browser.i18n.getMessage(key)
const formattedText = ref('')

const navigateBack = () => router.back()

const onInput = (value: string) => {
  formattedText.value = dj(value, store.options)
}
</script>

<style scoped>
.service {
  padding-bottom: 20px;
  height: 600px;
  display: flex;
  flex-direction: column;
}

.service h1 {
  text-align: center;
  margin: 30px 0;
  position: relative;
}

.service .back {
  position: absolute;
  left: 20px;
  top: 2px;
  cursor: pointer;
}

.service-container {
  overflow: auto;
  flex: 1;
}

.service-label {
  padding: 0 20px;
  font-size: 16px;
  margin-bottom: 15px;
  display: block;
}

.service :deep(.v-input) {
  padding: 0 20px;
}
</style>
