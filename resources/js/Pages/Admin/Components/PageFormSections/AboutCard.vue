<!-- resources/js/Pages/Admin/Components/PageFormSections/AboutCard.vue -->
<script setup>
import { ref } from 'vue'
import DropzoneImage from '@/Ui/DropzoneImage.vue'

const about = defineModel({ type: Object, required: true })

const open = ref({ about: false })
const toggle = () => (open.value.about = !open.value.about)

const uid = () =>
  (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`

const ids = { title: uid(), text: uid() }
</script>

<template>
  <div class="card-wrap">
    <button type="button" class="card-head clickable" :aria-expanded="open.about" @click="toggle">
      <div class="chev" :class="{ open: open.about }"><i class="fa-solid fa-chevron-down" /></div>
      <h3 class="title">Sekce „O nás“</h3>
    </button>

    <div class="card-body" v-show="open.about">
      <div class="section-card">
        <div class="chip">O nás</div>

        <div class="title-field">
          <label class="label label--section" :for="ids.title">Titulek sekce</label>
          <input :id="ids.title" class="form-control title-input" v-model="about.title" placeholder="O nás" />
        </div>

        <div class="item-row">
          <label class="label" :for="ids.text">Text</label>
          <textarea :id="ids.text" class="form-control" rows="5" v-model="about.text" placeholder="Delší popis…" />
        </div>

        <div class="items-wrap">
          <div class="items-head"><span class="items-label">Obrázek sekce</span></div>
          <div class="item-row">
            <DropzoneImage
              v-model:file="about.image.file"
              v-model:url="about.image.src"
              :preview-w="320" :preview-h="210" preview-ratio="3/2"
              object-fit="cover"
              placeholder="Přetáhni nebo vyber obrázek"
              hint="PNG/JPG/WEBP ~ 1200×800 px."
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.section-card{ border:1px solid #e7e9ee; background:#fff; border-radius:14px; padding:16px; box-shadow:0 1px 0 rgba(16,24,40,.02); }
.chip{ display:inline-flex; align-items:center; font-weight:700; font-size:12px; line-height:1; padding:6px 10px; border-radius:999px; margin-bottom:12px; border:1px solid #ffd1d1; color:#b4231f; background:#ffe8e8; }
.title-field{ margin-bottom:14px; }
.label{ display:block; font-size:12px; font-weight:700; color:#6b7280; margin-bottom:6px; }
.label--section{ text-transform:uppercase; letter-spacing:.04em; }
.title-input{ font-weight:800; font-size:18px; padding:10px 12px; background:#fff; border-color:#e7e9ee; }
.items-wrap{ margin-top:6px; padding-top:12px; border-top:1px dashed #e5e7eb; }
.items-head{ display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; }
.items-label{ font-size:12px; font-weight:800; color:#6b7280; text-transform:uppercase; letter-spacing:.04em; }
.item-row{ background:#fafbfc; border:1px solid #eef0f3; border-radius:12px; padding:12px; }
</style>
