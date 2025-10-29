<!-- resources/js/Pages/Admin/Views/ContactEditView.vue -->
<script setup>
import PageForm from '@/Pages/Admin/Components/PageForm.vue'

const props = defineProps({
  contact: { type: Object, required: true }
})

const initial = props.contact
</script>

<template>
  <section>
    <div class="card-wrap">
      <h2 class="h5 fw-extrabold mt-1 mb-3">Upravit: Kontakt</h2>
      <PageForm key="contact" slug="kontakt" :initial="initial" />
    </div>
  </section>
</template>

<style scoped>
.card-wrap{ background:#fff; border:1px solid #e9eaeb; border-radius:12px; padding:16px; }
.fw-extrabold{ font-weight:800; }
</style>
