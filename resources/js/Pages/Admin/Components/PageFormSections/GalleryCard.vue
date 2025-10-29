<!-- resources/js/Pages/Admin/Components/PageFormSections/GalleryCard.vue -->
<script setup>
import { ref } from 'vue'
import DropzoneImage from '@/Ui/DropzoneImage.vue'

const gallery = defineModel({ type: Array, required: true })

const open = ref({ gallery: false })
const toggle = () => (open.value.gallery = !open.value.gallery)

function clearImage(i){
  const g = gallery[i]
  if (!g) return
  g.imageFile = null
  g.imageUrl  = null
  g.title = g.title || ''
  g.alt   = g.alt   || ''
}
</script>

<template>
  <div class="card-wrap">
    <button type="button" class="card-head clickable" :aria-expanded="open.gallery" @click="toggle">
      <div class="chev" :class="{ open: open.gallery }"><i class="fa-solid fa-chevron-down"/></div>
      <h3 class="title">Galerie (až 4 obrázky)</h3>
    </button>

    <div class="card-body" v-show="open.gallery">
      <div class="section-card">
        <div class="chip">Galerie</div>

        <div class="items-wrap">
          <div class="items-head"><span class="items-label">Obrázky</span></div>

          <div class="grid two align-start">
            <div v-for="(g, i) in gallery" :key="g.id ?? i" class="item-row">
              <DropzoneImage
                v-model:file="g.imageFile"
                v-model:url="g.imageUrl"
                :preview-w="220" :preview-h="135" preview-ratio="16/9"
                object-fit="cover"
                placeholder="Obrázek"
                hint="PNG/JPG/WEBP"
              />
              <div class="mt-2">
                <label class="label">Titulek</label>
                <input class="form-control" v-model="g.title" placeholder="Titulek obrázku" />
              </div>
              <div class="mt-2">
                <label class="label">Alt text</label>
                <input class="form-control" v-model="g.alt" placeholder="Popis (alt)" />
              </div>
              <div class="mt-2" style="display:flex;justify-content:flex-end;">
                <button class="btn btn-ghost danger" @click.prevent="clearImage(i)">
                  <i class="fa-regular fa-trash-can me-1" /> Vyčistit obrázek
                </button>
              </div>
            </div>
          </div>

          <small class="text-muted d-block mt-2">Doporučení: vyplň i alt (přístupnost).</small>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.section-card{ border:1px solid #e7e9ee; background:#fff; border-radius:14px; padding:16px; box-shadow:0 1px 0 rgba(16,24,40,.02); }
.chip{ display:inline-flex; align-items:center; font-weight:700; font-size:12px; line-height:1; padding:6px 10px; border-radius:999px; margin-bottom:12px; border:1px solid #ffd1d1; color:#b4231f; background:#ffe8e8; }
.items-wrap{ margin-top:6px; padding-top:12px; border-top:1px dashed #e5e7eb; }
.items-head{ display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; }
.items-label{ font-size:12px; font-weight:800; color:#6b7280; text-transform:uppercase; letter-spacing:.04em; }
.item-row{ background:#fafbfc; border:1px solid #eef0f3; border-radius:12px; padding:12px; }
.grid.two{ display:grid; grid-template-columns:1fr 1fr; gap:10px; }
@media (max-width: 768px){ .grid.two{ grid-template-columns: 1fr; } }
</style>
