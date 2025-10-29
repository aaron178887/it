<!-- resources/js/Pages/Admin/Components/PageFormSections/MapCard.vue -->
<script setup>
import { ref } from 'vue'

const mapModel = defineModel({ type: Object, required: true })

const open = ref({ map: false })
const toggle = () => (open.value.map = !open.value.map)

const uid = () =>
  (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`

const ids = { embed: uid(), link: uid() }
</script>

<template>
  <div class="card-wrap">
    <button type="button" class="card-head clickable" :aria-expanded="open.map" @click="toggle">
      <div class="chev" :class="{ open: open.map }"><i class="fa-solid fa-chevron-down" /></div>
      <h3 class="title">Mapa</h3>
    </button>

    <div class="card-body" v-show="open.map">
      <div class="section-card">
        <div class="chip">Mapa</div>

        <div class="items-wrap">
          <div class="items-head"><span class="items-label">Odkazy</span></div>

          <div class="item-row">
            <div class="grid two">
              <div>
                <label class="label" :for="ids.embed">Embed URL (iframe)</label>
                <input :id="ids.embed" class="form-control" v-model="mapModel.embed"
                       placeholder="https://www.google.com/maps?...&output=embed" />
                <small class="text-muted">Použij přímý &ldquo;embed&rdquo; odkaz (obsahuje <code>output=embed</code>).</small>
              </div>
              <div>
                <label class="label" :for="ids.link">Otevřít v Mapách (odkaz)</label>
                <input :id="ids.link" class="form-control" v-model="mapModel.link" placeholder="https://www.google.com/maps/..." />
                <small class="text-muted">Běžný odkaz pro otevření v nové kartě.</small>
              </div>
            </div>
          </div>
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
