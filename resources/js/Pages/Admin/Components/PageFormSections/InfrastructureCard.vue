<!-- resources/js/Pages/Admin/Components/PageFormSections/InfrastructureCard.vue -->
<script setup>
import { ref, onMounted } from 'vue'

/**
 * POZOR: defineModel vrací Ref – v JavaScript části musíme používat infra.value
 * (v šabloně se refy rozbalují automaticky).
 */
const infra = defineModel({ type: Object, required: true })

const open = ref({ infra: false })
const toggle = () => (open.value.infra = !open.value.infra)

/* stabilní klíče pro UI */
let _uid = 0
const nextKey = () => (++_uid)

/* --- helper: zajistí konzistentní tvar dat a doplní _k klíče --- */
function ensureInfraShape () {
  if (!infra.value || typeof infra.value !== 'object' || Array.isArray(infra.value)) {
    infra.value = { lead: '', blocks: [] }
  }
  if (!Array.isArray(infra.value.blocks)) infra.value.blocks = []

  infra.value.blocks.forEach((b) => {
    if (!b || typeof b !== 'object') return
    if (!Array.isArray(b.items)) b.items = []
    b.items.forEach((it) => { if (it && it._k == null) it._k = nextKey() })
    if (b.items.length === 0) b.items.push({ _k: nextKey(), badge: '', text: '' })
  })

  if (infra.value.blocks.length === 0) {
    infra.value.blocks.push({
      title: '',
      items: [{ _k: nextKey(), badge: '', text: '' }]
    })
  }
}

onMounted(() => {
  ensureInfraShape()
})

function addBlock () {
  ensureInfraShape()
  infra.value.blocks.push({
    title: '',
    items: [{ _k: nextKey(), badge: '', text: '' }]
  })
}

function removeBlock (bi) {
  if (!infra.value?.blocks) return
  if (bi < 0 || bi >= infra.value.blocks.length) return
  infra.value.blocks.splice(bi, 1)
  if (infra.value.blocks.length === 0) {
    infra.value.blocks.push({
      title: '',
      items: [{ _k: nextKey(), badge: '', text: '' }]
    })
  }
}

function addItem (bi) {
  const b = infra.value?.blocks?.[bi]
  if (!b) return
  if (!Array.isArray(b.items)) b.items = []
  b.items.push({ _k: nextKey(), badge: '', text: '' })
}

function removeItem (bi, ii) {
  const b = infra.value?.blocks?.[bi]
  if (!b || !Array.isArray(b.items)) return
  if (ii < 0 || ii >= b.items.length) return
  // drž aspoň jednu položku
  if (b.items.length > 1) {
    b.items.splice(ii, 1)
  } else {
    b.items.splice(0, 1, { _k: nextKey(), badge: '', text: '' })
  }
}
</script>

<template>
  <div class="card-wrap">
    <button type="button" class="card-head clickable" :aria-expanded="open.infra" @click="toggle">
      <div class="chev" :class="{ open: open.infra }"><i class="fa-solid fa-chevron-down" /></div>
      <h3 class="title">Infrastruktura</h3>
    </button>

    <div class="card-body" v-show="open.infra">
      <div class="mb-5">
        <label class="label">Úvodní věta</label>
        <input class="form-control" v-model="infra.lead" placeholder="Vlastní racky v datacentru…" />
      </div>

      <div class="items-head" style="display:flex;justify-content:space-between;align-items:center;margin:-4px 0 8px;">
        <span class="items-label">Bloky</span>
        <button class="btn btn-light border btn-sm" @click.stop="addBlock">
          <i class="fa-solid fa-plus me-1" /> Přidat blok
        </button>
      </div>

      <div class="vstack gap-5">
        <div v-for="(b, bi) in infra.blocks" :key="bi" class="infra-block">
          <div class="chip chip--danger">Blok {{ bi + 1 }}</div>

          <div class="title-field">
            <label class="label label--section">Nadpis bloku</label>
            <div class="row-right-inner">
              <input class="form-control title-input" v-model="b.title" placeholder="Např. Konfigurace serverů" />
              <button
                v-if="infra.blocks.length > 1"
                class="btn btn-ghost danger"
                title="Smazat blok"
                @click.stop="removeBlock(bi)"
              >
                <i class="fa-regular fa-trash-can" />
              </button>
            </div>
          </div>

          <div class="items-wrap">
            <div class="items-head">
              <span class="items-label">Položky</span>
              <button class="btn btn-light border btn-sm" @click.stop="addItem(bi)">
                <i class="fa-solid fa-plus me-1" /> Přidat položku
              </button>
            </div>

            <div class="vstack item-list">
              <div v-for="(it, ii) in b.items" :key="it._k ?? ii" class="item-row">
                <div class="grid two gap-3 align-start">
                  <div class="field">
                    <label class="label">Štítek</label>
                    <input class="form-control" v-model="it.badge" placeholder="Např. Virtualizace" />
                  </div>
                  <div class="field">
                    <label class="label">Text</label>
                    <div class="row-right-inner">
                      <input class="form-control" v-model="it.text" placeholder="Např. KVM + Proxmox" />
                      <button
                        class="btn btn-ghost danger"
                        v-if="b.items.length > 1"
                        @click.stop="removeItem(bi, ii)"
                        title="Smazat položku"
                      >
                        <i class="fa-regular fa-trash-can" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <p v-if="!b.items || b.items.length === 0" class="text-muted small">
                Zatím žádné položky. Klikni na “Přidat položku”.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.infra-block{
  border:1px solid #e7e9ee; background:#fff; border-radius:14px; padding:16px; box-shadow:0 1px 0 rgba(16,24,40,.02);
}
.chip{
  display:inline-flex; align-items:center; font-weight:700; font-size:12px; line-height:1;
  padding:6px 10px; border-radius:999px; margin-bottom:10px;
  border:1px solid #ffd1d1; color:#b4231f; background:#ffe8e8;
}
.chip--danger{ border-color:#ffd1d1; color:#b4231f; background:#ffe8e8; }
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
.row-right-inner .form-control{ flex:1; }

.grid.two{ grid-template-columns: 1fr 1fr; display:grid; gap:10px; }
@media (max-width: 768px){ .grid.two{ grid-template-columns: 1fr; } }
</style>
