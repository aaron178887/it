<!-- resources/js/Pages/Admin/Components/PageFormSections/ContactCard.vue -->
<script setup>
import { ref } from 'vue'

const contacts = defineModel({ type: Object, required: true })

const open = ref({ contact: false })
const toggle = () => (open.value.contact = !open.value.contact)

const uid = () =>
  (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`

const ids = {
  note: uid(), address: uid(), email: uid(), phone: uid()
}
</script>

<template>
  <div class="card-wrap">
    <button type="button" class="card-head clickable" :aria-expanded="open.contact" @click="toggle">
      <div class="chev" :class="{ open: open.contact }"><i class="fa-solid fa-chevron-down" /></div>
      <h3 class="title">Kontakty</h3>
    </button>

    <div class="card-body" v-show="open.contact">
      <div class="section-card">
        <div class="chip">Kontakt</div>

        <div class="items-wrap">
          <div class="items-head"><span class="items-label">Údaje</span></div>
          <div class="item-row">
            <div class="grid two">
              <div>
                <label class="label" :for="ids.note">Poznámka</label>
                <input :id="ids.note" class="form-control" v-model="contacts.note" placeholder="K dispozici 24/7" />
              </div>
              <div>
                <label class="label" :for="ids.address">Adresa</label>
                <input :id="ids.address" class="form-control" v-model="contacts.address"
                       placeholder="Orlické Podhůří 30, 562 01 Ústí nad Orlicí"
                       autocomplete="street-address" />
              </div>
            </div>
            <div class="grid two mt-2">
              <div>
                <label class="label" :for="ids.email">E-mail</label>
                <input :id="ids.email" class="form-control" v-model="contacts.email" type="email"
                       placeholder="info@openvps.cz" autocomplete="email" inputmode="email" />
              </div>
              <div>
                <label class="label" :for="ids.phone">Telefon</label>
                <input :id="ids.phone" class="form-control" v-model="contacts.phone"
                       placeholder="+420 ..." autocomplete="tel" inputmode="tel" />
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
