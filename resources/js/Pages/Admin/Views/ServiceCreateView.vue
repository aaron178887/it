<!-- resources/js/Pages/Admin/Views/ServiceCreateView.vue -->
<script setup>
import ServiceForm from '@/Pages/Admin/Components/Services/Form.vue'
</script>

<template>
  <section>
    <div class="card-wrap">
      <h2 class="h5 fw-extrabold mt-1 mb-3">Přidat stránku</h2>
      <ServiceForm mode="create" />
    </div>
  </section>
</template>

<style scoped>
.card-wrap{ background:#fff; border:1px solid #e9eaeb; border-radius:12px; padding:16px; }
.fw-extrabold{ font-weight:800; }
</style>
