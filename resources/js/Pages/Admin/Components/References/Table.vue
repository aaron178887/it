<!-- Components/References/Table.vue -->
<script setup>
import { computed, ref } from 'vue'
import { router } from '@inertiajs/vue3'

const props = defineProps({
  items: { type: Array, default: () => [] }
})

const rows = computed(() =>
  (props.items || []).map(r => ({
    id:    r.id,
    title: r.title || '',
    tag:   r.tag || '',
    logo:  r.logo || '',
  }))
)

const deleting = ref(new Set())
const isDeleting = (id) => deleting.value.has(id)

function removeRow(row){
  if (!confirm(`Opravdu smazat „${row.title}“?`)) return
  deleting.value.add(row.id)
  router.delete(`/admin/references/${row.id}`, {
    preserveScroll: true,
    onFinish: () => deleting.value.delete(row.id),
  })
}

function editRow(row) {
  router.visit(`?view=references&id=${row.id}`, { replace:true, preserveScroll: true })
}
</script>

<template>
  <div class="card-wrap">
    <div class="card-head">
      <h3 class="title">Seznam referencí</h3>
      <div class="muted"><strong>{{ rows.length }}</strong>&nbsp;položek</div>
    </div>

    <div class="table-responsive">
      <table class="table align-middle">
        <thead>
          <tr>
            <th class="col-logo">Logo</th>
            <th>Název</th>
            <th>Štítek</th>
            <th class="col-actions">Akce</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(r, i) in rows" :key="r.id ?? `tmp-${i}`">
            <td>
              <img v-if="r.logo" :src="r.logo" alt="" class="thumb" />
              <span v-else class="text-muted">—</span>
            </td>
            <td class="fw-800">{{ r.title }}</td>
            <td>{{ r.tag || '—' }}</td>
            <td>
              <div class="actions">
                <button class="btn-ghost" @click="editRow(r)" title="Upravit">
                  <i class="fa-regular fa-pen-to-square" />
                </button>
                <button
                  class="btn-ghost danger"
                  :aria-busy="isDeleting(r.id)"
                  :disabled="isDeleting(r.id)"
                  @click="removeRow(r)"
                  title="Smazat"
                >
                  <i class="fa-regular fa-trash-can" />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="rows.length===0">
            <td colspan="4" class="text-center text-muted py-4">Zatím žádné reference.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card-wrap{ background:#fff; border:1px solid #e9eaeb; border-radius:12px; padding:16px; }
.card-head{ display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
.title{ margin:0; font:800 16px/1 "Sora",system-ui,sans-serif; }
.muted{ color:#7b8089; }
.fw-800{ font-weight:800; }
.thumb{ width:64px; height:40px; object-fit:contain; background:#fff; border:1px solid #edf0f2; border-radius:8px; }
.actions{ display:flex; gap:8px; }
.btn-ghost{
  width:34px; height:34px; border-radius:10px; border:1px solid #e9eaeb;
  background:#fff; display:grid; place-items:center; color:#111827; transition:.15s;
}
.btn-ghost:hover{ background:#f8fafc; transform: translateY(-1px); }
.btn-ghost.danger{ color:#b4231f; border-color:#fde2e1; }
.btn-ghost.danger:hover{ background:#fff5f5; }
.text-muted{ color:#7b8089; }

.col-logo{ width:84px; }
.col-actions{ width:180px; }
</style>
