<!-- resources/js/Pages/Admin/Components/PageFormSections/HeroCard.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import DropzoneImage from '@/Ui/DropzoneImage.vue'

const hero  = defineModel({ type: Object, required: true })
const props = defineProps({ aboutEnabled: { type: Boolean, default: false } })

const open = ref({ hero: false })
const toggle = () => (open.value.hero = !open.value.hero)

/* helpers */
const uid = () =>
  (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`

const ids = {
  title: uid(),
  subtitle: uid(),
}

onMounted(() => {
  if (!Array.isArray(hero.counters)) hero.counters = []
})

function addCounter(){ hero.counters.push({ label:'', value:'' }) }
function removeCounter(i){ hero.counters.splice(i, 1) }
</script>

<template>
  <div class="card-wrap">
    <button type="button" class="card-head clickable" :aria-expanded="open.hero" @click="toggle">
      <div class="chev" :class="{ open: open.hero }"><i class="fa-solid fa-chevron-down" /></div>
      <h3 class="title">Hero (součást content)</h3>
    </button>

    <div class="card-body" v-show="open.hero">
      <div class="section-card">
        <div class="chip">Hero</div>

        <div class="title-field">
          <label class="label label--section" :for="ids.title">Nadpis</label>
          <input :id="ids.title" class="form-control title-input" v-model="hero.title" placeholder="Např. Naše mise" />
        </div>

        <div class="item-row">
          <label class="label" :for="ids.subtitle">Podnadpis</label>
          <input :id="ids.subtitle" class="form-control" v-model="hero.subtitle" placeholder="Krátký podtitulek…" />
        </div>

        <div class="items-wrap">
          <div class="items-head"><span class="items-label">Obrázek</span></div>
          <div class="item-row">
            <DropzoneImage
              v-model:file="hero.imageFile"
              v-model:url="hero.image"
              :preview-w="420" :preview-h="236" preview-ratio="16/9"
              object-fit="cover"
              placeholder="Přetáhni nebo vyber obrázek"
              hint="PNG/JPG/WEBP, ideálně 1600×900 px."
            />
          </div>
        </div>

        <div v-if="props.aboutEnabled" class="items-wrap mt-3">
          <div class="items-head">
            <span class="items-label">Počítadla</span>
            <button class="btn btn-light border btn-sm" @click.stop="addCounter">
              <i class="fa-solid fa-plus me-1" /> Přidat počítadlo
            </button>
          </div>
          <div class="vstack item-list">
            <div v-for="(c, i) in hero.counters" :key="i" class="item-row">
              <div class="grid two gap-3 align-start">
                <div>
                  <label class="label">Popisek</label>
                  <input class="form-control" v-model="c.label" placeholder="Např. Působíme v ČR" />
                </div>
                <div>
                  <label class="label">Hodnota</label>
                  <div class="row-right-inner">
                    <input class="form-control" v-model="c.value" placeholder="Např. 21 let" />
                    <button
                      v-if="hero.counters.length > 1"
                      class="btn btn-ghost danger"
                      @click.stop="removeCounter(i)"
                      title="Smazat položku"
                    >
                      <i class="fa-regular fa-trash-can" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <p v-if="!hero.counters.length" class="text-muted small">Zatím žádná počítadla.</p>
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
.item-list{ display:flex; flex-direction:column; gap:10px; }
.item-row{ background:#fafbfc; border:1px solid #eef0f3; border-radius:12px; padding:12px; }
.row-right-inner{ display:flex; gap:8px; align-items:center; }
</style>
