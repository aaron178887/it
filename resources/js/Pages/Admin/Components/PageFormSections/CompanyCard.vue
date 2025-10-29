<!-- resources/js/Pages/Admin/Components/PageFormSections/CompanyCard.vue -->
<script setup>
import { ref } from 'vue'

const company = defineModel({ type: Object, required: true })

const open = ref({ company: false })
const toggle = () => (open.value.company = !open.value.company)

const uid = () =>
  (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`

const ids = {
  name: uid(), ic: uid(), dic: uid(), reg: uid()
}
</script>

<template>
  <div class="card-wrap">
    <button type="button" class="card-head clickable" :aria-expanded="open.company" @click="toggle">
      <div class="chev" :class="{ open: open.company }"><i class="fa-solid fa-chevron-down" /></div>
      <h3 class="title">Firemní údaje</h3>
    </button>

    <div class="card-body" v-show="open.company">
      <div class="section-card">
        <div class="chip">Společnost</div>

        <div class="items-wrap">
          <div class="items-head"><span class="items-label">Základní údaje</span></div>

          <div class="item-row">
            <div class="grid two">
              <div>
                <label class="label" :for="ids.name">Název</label>
                <input :id="ids.name" class="form-control" v-model="company.name" placeholder="IT Globe s.r.o. (OpenVPS)"
                       autocomplete="organization" />
              </div>
              <div>
                <label class="label" :for="ids.ic">IČ</label>
                <input :id="ids.ic" class="form-control" v-model="company.ic" placeholder="14117215"
                       inputmode="numeric" pattern="[0-9]*" />
              </div>
            </div>

            <div class="grid two mt-2">
              <div>
                <label class="label" :for="ids.dic">DIČ</label>
                <input :id="ids.dic" class="form-control" v-model="company.dic" />
              </div>
              <div>
                <label class="label" :for="ids.reg">Obchodní rejstřík</label>
                <input :id="ids.reg" class="form-control" v-model="company.registry" placeholder="Krajský soud v ..." />
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
