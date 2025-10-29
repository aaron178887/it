<!-- resources/js/Pages/Admin/Components/Services/Table.vue -->
<script setup>
import { computed, ref } from 'vue'
import { Link, useForm } from '@inertiajs/vue3'

import {
  CATEGORY_LABEL_BY_SLUG,   // { 'servery':'Servery', 'aplikace':'Aplikace', ... }
  CATEGORY_LABEL_BY_KEY,    // { 'server':'Servery', 'aplikace':'Aplikace', 'kontejner':'Kontejnery' }
  BY_LABEL,                 // { 'Servery':'server', 'Aplikace':'aplikace', ... }
} from '@/Helpers/services.constants.js'

const props = defineProps({
  items: { type: Array, default: () => [] }
})

/** Striktní mapování bez aliasů/překlepů. */
const prettyCategory = (cat) => {
  const raw = String(cat ?? '').trim()
  if (!raw) return '—'
  const lc = raw.toLowerCase()

  // slug → label
  if (lc in CATEGORY_LABEL_BY_SLUG) return CATEGORY_LABEL_BY_SLUG[lc]
  // key → label
  if (lc in CATEGORY_LABEL_BY_KEY)  return CATEGORY_LABEL_BY_KEY[lc]
  // label → key → label (jen přes přesnou shodu labelu)
  const keyFromLabel = BY_LABEL[raw]
  if (keyFromLabel && (keyFromLabel in CATEGORY_LABEL_BY_KEY)) {
    return CATEGORY_LABEL_BY_KEY[keyFromLabel]
  }
  // neznámá hodnota (neopravujeme ji)
  return '—'
}

const rows = computed(() =>
  (props.items || []).map(s => ({
    id: s.id,
    title: s.title || '',
    slug:  s.slug  || '',
    url:   `/sluzby/${s.slug}`,
    previewUrl: `/admin/services/${s.id}/preview`,
    category:  s.category || '',
    categoryDisplay: prettyCategory(s.category),
    published: !!s.is_published,
  }))
)

/* Publikace přes useForm (optimistický update) */
const publishForm = useForm({})
const activePublishId = ref(null)

function onToggle(row, nextVal) {
  const prev = row.published
  row.published = nextVal
  activePublishId.value = row.id

  publishForm.patch(`/admin/services/${row.id}/publish`, {
    data: { is_published: nextVal },
    preserveScroll: true,
    onError: () => { row.published = prev },
    onFinish: () => { activePublishId.value = null },
  })
}
const isPublishing = (id) => publishForm.processing && activePublishId.value === id

/* Delete přes useForm */
const deleteForm = useForm({})
const activeDeleteId = ref(null)
const isDeleting = (id) => deleteForm.processing && activeDeleteId.value === id

function deleteItem(row){
  if (!confirm(`Opravdu smazat „${row.title}"? Tuto akci nelze vrátit.`)) return
  activeDeleteId.value = row.id
  deleteForm.delete(`/admin/services/${row.id}`, {
    preserveScroll: true,
    onFinish: () => { activeDeleteId.value = null },
  })
}
</script>

<template>
  <div class="card-wrap" aria-live="polite">
    <div class="card-head">
      <h3 class="title">Stránky (služby)</h3>
      <div class="meta muted"><strong>{{ rows.length }}</strong>&nbsp;položek</div>
    </div>

    <div class="table-responsive">
      <table class="table align-middle">
        <thead>
          <tr>
            <th>Název</th>
            <th>Kategorie</th>
            <th style="width:160px">Publikovat</th>
            <th style="width:168px">Akce</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="r in rows" :key="r.id || r.slug">
            <td class="fw-800">
              <span class="name-pink">{{ r.title }}</span>
            </td>

            <td>
              {{ r.categoryDisplay }}
            </td>

            <td>
              <label
                class="switch"
                :class="{ busy: isPublishing(r.id) }"
                :title="r.published ? 'Skrýt z webu' : 'Zveřejnit na webu'"
                role="switch"
                :aria-checked="r.published"
              >
                <input
                  type="checkbox"
                  :checked="r.published"
                  :disabled="isPublishing(r.id)"
                  @change="onToggle(r, $event.target.checked)"
                  aria-label="Přepnout publikaci"
                />
                <span class="slider"></span>
              </label>
            </td>

            <td>
              <div class="actions">
                <a class="btn-ghost" :href="r.previewUrl" target="_blank" rel="noopener" title="Náhled (admin)">
                  <i class="fa-regular fa-eye"></i>
                </a>
                <a class="btn-ghost" :href="r.url" target="_blank" rel="noopener" title="Otevřít veřejnou URL">
                  <i class="fa-solid fa-arrow-up-right-from-square"></i>
                </a>
                <Link class="btn-ghost" :href="`/admin?view=service&id=${r.id}`" title="Upravit" preserve-scroll>
                  <i class="fa-regular fa-pen-to-square"></i>
                </Link>
                <button
                  class="btn-ghost danger"
                  :disabled="isDeleting(r.id)"
                  :title="isDeleting(r.id) ? 'Mažu…' : 'Smazat'"
                  @click="deleteItem(r)"
                >
                  <i class="fa-regular fa-trash-can"></i>
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="rows.length === 0">
            <td colspan="4" class="text-center text-muted py-4">
              Zatím žádné stránky.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- případné chyby akcí -->
    <div v-if="Object.keys(publishForm.errors).length" class="alert alert-danger mt-3">
      <div v-for="(msg, key) in publishForm.errors" :key="key">{{ msg }}</div>
    </div>
    <div v-if="Object.keys(deleteForm.errors).length" class="alert alert-danger mt-2">
      <div v-for="(msg, key) in deleteForm.errors" :key="key">{{ msg }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card-wrap{ background:#fff; border:1px solid #e9eaeb; border-radius:12px; padding:16px; }
.card-head{ display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; gap:8px; }
.title{ margin:0; font:800 16px/1 "Sora",system-ui,sans-serif; }
.meta{ justify-self:end; }

.table thead th{ font-weight:800; white-space:nowrap; }
.fw-800{ font-weight:800; }

.name-pink{ color:#e83e8c; font-weight:700; }

.actions{ display:flex; gap:8px; justify-content:flex-start; }
.btn-ghost{
  width:34px; height:34px; border-radius:10px; border:1px solid #e9eaeb;
  background:#fff; display:grid; place-items:center; color:#111827; transition:.15s;
}
.btn-ghost:hover{ background:#f8fafc; transform: translateY(-1px); }
.btn-ghost[disabled]{ opacity:.6; cursor:not-allowed; transform:none; }
.btn-ghost.danger{ color:#b4231f; border-color:#fde2e1; }
.btn-ghost.danger:hover{ background:#fff5f5; }

/* switch */
.switch{ position:relative; display:inline-block; width:54px; height:28px; vertical-align:middle; }
.switch input{ display:none; }
.slider{ position:absolute; cursor:pointer; inset:0; background:#e5e7eb; border-radius:999px; transition:.2s; }
.slider:before{ content:""; position:absolute; height:22px; width:22px; left:3px; top:3px; background:white; border:1px solid #e3e5e7; border-radius:50%; transition:.2s; box-shadow:0 1px 2px rgba(0,0,0,.06); }
[role="switch"][aria-checked="true"] .slider{ background:#c7eed8; }
[role="switch"][aria-checked="true"] .slider:before{ transform:translateX(26px); }
.switch.busy .slider{ opacity:.6; }
.switch.busy .slider:before{ box-shadow:0 0 0 2px rgba(0,0,0,.05) inset; }
</style>
