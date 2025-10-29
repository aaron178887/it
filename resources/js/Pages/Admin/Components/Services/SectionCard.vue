<script setup>
import { computed } from 'vue'
import DropzoneImage from '@/Ui/DropzoneImage.vue'
import RichTextEditor from '@/Ui/RichTextEditor.vue'

const section = defineModel({ type: Object, required: true })

const props = defineProps({
  index: { type: Number, required: true },
  total: { type: Number, required: true }
})
const emit = defineEmits(['moveUp','moveDown','insertBelow','remove'])

const needsImage   = computed(() => ['split-left','split-right'].includes(section.value.layout))
const needsTwoCols = computed(() => section.value.layout === 'columns')

const layoutLabel = computed(() => {
  switch (section.value.layout) {
    case 'split-left':  return 'Obrázek + text'
    case 'split-right': return 'Text + obrázek'
    case 'columns':     return 'Dva sloupce'
    default:            return 'Jen text'
  }
})
</script>

<template>
  <div class="section-card" :data-sid="section.id" tabindex="-1">
    <div class="section-head">
      <div class="info">
        <span class="badge">Sekce #{{ index + 1 }}</span>
        <strong class="title">{{ section.title || 'Bez názvu' }}</strong>
        <span class="muted">({{ layoutLabel }})</span>
      </div>

      <div class="actions">
        <button class="btn btn-light border btn-sm" :disabled="index===0"
                title="Přesunout nahoru"
                :aria-label="`Přesunout sekci ${index+1} nahoru`"
                @click="$emit('moveUp', index)">
          <i class="fa-solid fa-arrow-up"></i>
        </button>
        <button class="btn btn-light border btn-sm" :disabled="index===total-1"
                title="Přesunout dolů"
                :aria-label="`Přesunout sekci ${index+1} dolů`"
                @click="$emit('moveDown', index)">
          <i class="fa-solid fa-arrow-down"></i>
        </button>
        <button class="btn btn-light border btn-sm"
                title="Přidat prázdnou sekci pod"
                :aria-label="`Přidat prázdnou sekci pod sekci ${index+1}`"
                @click="$emit('insertBelow', index)">
          <i class="fa-solid fa-plus"></i>
        </button>
        <button class="btn btn-outline-danger btn-sm"
                title="Smazat sekci"
                :aria-label="`Smazat sekci ${index+1}`"
                @click="$emit('remove', index)">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    </div>

    <div class="layout-picker" role="group" aria-label="Rozložení sekce">
      <button type="button"
              :class="['layout-card', section.layout==='split-left' && 'selected']"
              :aria-pressed="section.layout==='split-left'"
              @click="section.layout='split-left'">
        <div class="wire wire-split">
          <span class="img left"></span><span class="txt right"></span>
        </div>
        <span class="label"><i class="fa-solid fa-image me-1"></i> Obrázek + text</span>
      </button>

      <button type="button"
              :class="['layout-card', section.layout==='split-right' && 'selected']"
              :aria-pressed="section.layout==='split-right'"
              @click="section.layout='split-right'">
        <div class="wire wire-split">
          <span class="txt left"></span><span class="img right"></span>
        </div>
        <span class="label"><i class="fa-solid fa-image me-1"></i> Text + obrázek</span>
      </button>

      <button type="button"
              :class="['layout-card', section.layout==='text' && 'selected']"
              :aria-pressed="section.layout==='text'"
              @click="section.layout='text'">
        <div class="wire wire-text"></div>
        <span class="label"><i class="fa-solid fa-align-left me-1"></i> Jen text</span>
      </button>

      <button type="button"
              :class="['layout-card', section.layout==='columns' && 'selected']"
              :aria-pressed="section.layout==='columns'"
              @click="section.layout='columns'">
        <div class="wire wire-cols"></div>
        <span class="label"><i class="fa-solid fa-columns me-1"></i> Dva sloupce textu</span>
      </button>
    </div>

    <div class="fields">
      <div class="mb-3">
        <label class="form-label">Nadpis sekce (nepovinné)</label>
        <input v-model="section.title" class="form-control" placeholder="např. VPS bez kompromisů" />
      </div>

      <div class="mb-3">
        <RichTextEditor
          label="Text 1"
          placeholder="Obsah první části…"
          v-model="section.text1"
          v-model:html="section.text1Html"
        />
      </div>

      <div v-if="needsTwoCols" class="mb-3">
        <RichTextEditor
          label="Text 2 (volitelně)"
          placeholder="Doplňující text…"
          v-model="section.text2"
          v-model:html="section.text2Html"
        />
      </div>

      <div v-if="needsImage" class="mb-2">
        <label class="form-label">Obrázek sekce</label>
        <DropzoneImage
          v-model:file="section.imageFile"
          v-model:url="section.imageUrl"
          :preview-w="260"
          :preview-h="150"
          preview-ratio="16 / 9"
          object-fit="cover"
          placeholder="Přetáhni sem obrázek nebo vyber soubor"
          hint="PNG/JPG, ideálně 1200×800px."
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.section-card{
  border:1px solid #e9eaeb; border-radius:12px; padding:14px; background:#fff; margin-bottom:14px;
  outline: none;
  scroll-margin-top: 120px;
}
.section-card:focus-visible{ box-shadow:0 0 0 3px rgba(16,185,129,.22); border-color:#b6e5dc; }

.section-head{
  display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:10px;
  .info{
    display:flex; align-items:center; gap:14px; flex-wrap:wrap;
    .badge{ background:#f1f5f9; border:1px solid #e2e8f0; color:#111827; font-weight:800; }
    .title{ font:800 16px/1.2 "Sora", system-ui, sans-serif; }
    .muted{ color:#6b7280; font-weight:700; }
  }
  .actions{ display:flex; gap:6px; }
}

.layout-picker{
  display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap:12px; margin-bottom:12px;
}
.layout-card{
  position:relative; display:flex; flex-direction:column; align-items:center; gap:10px;
  width:100%; padding:14px; background:#fff; border:1px solid #e9eaeb; border-radius:12px;
  cursor:pointer; transition: transform .06s ease, border-color .15s ease, box-shadow .15s ease;
}
.layout-card:hover{ transform: translateY(-1px); border-color:#dfe3e7; box-shadow:0 6px 18px rgba(0,0,0,.06); }
.layout-card.selected{ border-color:#b6e5dc; box-shadow: 0 0 0 3px rgba(16,185,129,.18); }
.layout-card .label{ font-weight:800; }

.wire{
  width:100%; height:110px; border:1px dashed #e1e5ea; border-radius:10px; background:#fafbfc;
  position:relative; overflow:hidden; padding:8px; display:flex; gap:8px;
}
.wire .img{ flex:1; background:#e9eaeb; border-radius:8px; }
.wire .txt{ flex:1; border-radius:8px; background:
  linear-gradient(#e9eaeb 12px, transparent 12px) top left/90% 20px repeat-y; }
.wire-split .left{ order:0; } .wire-split .right{ order:1; }
.wire-text{ background:
  linear-gradient(#e9eaeb 12px, transparent 12px) top left/92% 22px repeat-y; border-radius:10px; }
.wire-cols{ display:grid; grid-template-columns:1fr 1fr; gap:8px; }
.wire-cols::before, .wire-cols::after{
  content:""; display:block; border-radius:8px; background:
  linear-gradient(#e9eaeb 12px, transparent 12px) top left/92% 22px repeat-y;
}
</style>
