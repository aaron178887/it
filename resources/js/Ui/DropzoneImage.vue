<script setup>
import { ref, onBeforeUnmount, onMounted, watch, computed } from 'vue'

const file = defineModel('file', { default: null })
const url  = defineModel('url',  { default: '' })

const props = defineProps({
  accept:        { type: String, default: 'image/*' },
  height:        { type: [Number, String], default: 360 },
  placeholder:   { type: String, default: 'Přetáhni sem obrázek nebo vyber soubor' },
  hint:          { type: String, default: 'PNG/JPG/WEBP.' },
  previewW:      { type: Number, default: 400 },
  previewH:      { type: Number, default: 240 },
  previewRatio:  { type: [String, Number], default: '16 / 9' },
  objectFit:     { type: String, default: 'cover' },
})

const emit = defineEmits(['change'])

const isOver = ref(false)
const inputEl = ref(null)
const blobOwned = ref(false)

const thumbStyle = computed(() => ({
  maxWidth:  props.previewW + 'px',
  maxHeight: props.previewH + 'px',
  aspectRatio: String(props.previewRatio),
}))
const imgStyle = computed(() => ({ objectFit: props.objectFit }))

function revokeIfOwned () {
  if (url.value && blobOwned.value && url.value.startsWith('blob:')) {
    try { URL.revokeObjectURL(url.value) } catch {}
  }
}

/** vytvoří náhled z File a uloží novou blob URL do v-model:url */
function setPreviewFromFile (f) {
  if (!f || !f.type?.startsWith?.('image/')) return
  revokeIfOwned()
  url.value = URL.createObjectURL(f)
  blobOwned.value = true
}

function setImage (f) {
  if (!f || !f.type?.startsWith?.('image/')) return
  file.value = f
  setPreviewFromFile(f)
  emit('change', f)
}

function onDrop (e) {
  e.preventDefault()
  isOver.value = false
  setImage(e.dataTransfer?.files?.[0])
}

function onChange (e) {
  setImage(e.target.files?.[0])
  if (inputEl.value) inputEl.value.value = ''
}

function openPicker () { inputEl.value?.click?.() }

onMounted(() => {
  if (file.value instanceof File) setPreviewFromFile(file.value)
})


watch(file, (f) => {
  if (f instanceof File) {
    setPreviewFromFile(f)
  } else if (!f) {
    revokeIfOwned()
    url.value = ''
    blobOwned.value = false
  }
})

onBeforeUnmount(() => { revokeIfOwned() })
</script>

<template>
  <div
    class="dropzone"
    :class="{ over: isOver }"
    @dragover.prevent="isOver=true"
    @dragleave.prevent="isOver=false"
    @drop="onDrop"
    @click="openPicker"
    role="button"
    tabindex="0"
    @keydown.enter.prevent="openPicker"
    @keydown.space.prevent="openPicker"
  >
    <div v-if="!url" class="dz-inner">
      <i class="fa-solid fa-image dz-ico"></i>
      <p class="dz-title">{{ placeholder }}</p>
      <p v-if="hint" class="dz-hint">{{ hint }}</p>
    </div>

    <div v-else class="dz-preview">
      <div class="thumb" :style="thumbStyle">
        <img :src="url" alt="Náhled" class="thumb-img clickable" :style="imgStyle" />
      </div>
      <div class="dz-actions">
        <button class="btn btn-primary btn-sm" @click.stop.prevent="openPicker">Nahradit…</button>
      </div>
    </div>

    <input ref="inputEl" type="file" class="sr-only" :accept="props.accept" @change="onChange" />
  </div>
</template>

<style scoped lang="scss">
.dropzone{
  width:100%;
  position:relative;
  border:2px dashed #e1e5ea;
  border-radius:12px;
  background:#fafbfc;
  padding:18px;
  text-align:center;
  transition: border-color .15s ease, background .15s ease;
  min-height:200px;
}
.dropzone.over{
  border-color: color-mix(in srgb, var(--Accent) 40%, transparent);
  background:#fff;
}

.dz-inner{ display:flex; flex-direction:column; align-items:center; gap:6px; }
.dz-ico{ font-size:36px; opacity:.7; }
.dz-title{ margin:6px 0 2px; font-weight:800; }
.dz-hint{ margin:0; color:#7b8089; font-size:.875rem; }

.dz-preview{ display:flex; flex-direction:column; gap:12px; align-items:center; }

.thumb{
  width:100%;
  display:flex;
  align-items:center;
  justify-content:center;
  overflow:hidden;
  border-radius:10px;
  background:#fff;
}
.thumb-img{ width:100%; height:100%; display:block; }

.dz-actions{ display:flex; gap:8px; }

.sr-only{
  position:absolute; width:1px; height:1px; padding:0; margin:-1px;
  overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0;
}
</style>
