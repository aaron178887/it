<!-- resources/js/Pages/Admin/Views/ReferenceIndexView.vue -->
<script setup>
import { computed } from 'vue'
import { router } from '@inertiajs/vue3'
import Table from '@/Pages/Admin/Components/References/Table.vue'
import Form  from '@/Pages/Admin/Components/References/Form.vue'

const props = defineProps({
  references: { type: Array,  default: () => [] },
  reference:  { type: Object, default: null },
  // typ musí být konstruktor; default může být null
  editId:     { type: Number, default: null },
  // 'list' | 'create' | 'edit'
  mode:       { type: String, default: 'list' },
})

const isCreate = computed(() => props.mode === 'create')
const isList   = computed(() => props.mode === 'list' && props.editId == null)

function backToList () {
  router.visit('?view=references', { replace:true, preserveScroll:true })
}
</script>

<template>
  <section v-if="isList">
    <Table :items="references" />
  </section>

  <section v-else>
    <div class="d-flex align-items-center justify-content-between gap-2 mb-2">
      <small class="text-muted" v-if="!isCreate">Upravuješ ID: {{ reference?.id }}</small>
      <button class="btn btn-light border btn-sm" @click="backToList">← Zpět na seznam</button>
    </div>

    <div class="card-wrap">
      <h2 class="h5 fw-extrabold mt-1 mb-3">
        {{ isCreate ? 'Přidat referenci' : `Upravit: ${reference?.title ?? ''}` }}
      </h2>
      <!-- key zajistí čistý remount mezi create/edit -->
      <Form
        :key="isCreate ? 'create' : (reference?.id ?? 'none')"
        :mode="isCreate ? 'create' : 'edit'"
        :initial="reference || {}"
      />
    </div>
  </section>
</template>

<style scoped>
.card-wrap{ background:#fff; border:1px solid #e9eaeb; border-radius:12px; padding:16px; }
.fw-extrabold{ font-weight:800; }
.btn{ cursor:pointer; }
</style>
