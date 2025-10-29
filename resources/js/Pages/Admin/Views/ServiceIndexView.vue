<!-- resources/js/Pages/Admin/Views/ServiceIndexView.vue -->
<script setup>
import { router } from '@inertiajs/vue3'
import ServicesTable from '@/Pages/Admin/Components/Services/Table.vue'
import ServiceForm   from '@/Pages/Admin/Components/Services/Form.vue'

const props = defineProps({
  services: { type: Array,  default: () => [] },
  service:  { type: Object, default: null },
  editId:   { type: Number, default: null },
})

function backToList(){ router.visit(`?view=service`, { replace:true, preserveScroll:true }) }
</script>

<template>
  <section v-if="service">
    <div class="d-flex align-items-center justify-content-between gap-2 mb-2">
      <small class="text-muted">Upravuješ ID: {{ editId ?? service?.id }}</small>
      <button class="btn btn-light border btn-sm" @click="backToList">← Zpět na seznam</button>
    </div>
    <div class="card-wrap">
      <h2 class="h5 fw-extrabold mt-1 mb-3">Upravit: {{ service.title }}</h2>
      <ServiceForm mode="edit" :initial="service" />
    </div>
  </section>

  <section v-else>
    <!-- žádné tlačítko „Přidat stránku“ – je v layoutu (#actions) -->
    <ServicesTable :items="services" />
  </section>
</template>

<style scoped>
.card-wrap{ background:#fff; border:1px solid #e9eaeb; border-radius:12px; padding:16px; }
.fw-extrabold{ font-weight:800; }
.btn{ cursor:pointer; }
</style>
