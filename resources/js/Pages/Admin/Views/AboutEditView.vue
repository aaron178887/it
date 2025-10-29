<!-- resources/js/Pages/Admin/Views/AboutEditView.vue -->
<script setup>
import PageForm from '@/Pages/Admin/Components/PageForm.vue'

const props = defineProps({
  about: { type: Object, required: true }
})

const initial = props.about
</script>

<template>
  <section>
    <div class="card-wrap">
      <h2 class="h5 fw-extrabold mt-1 mb-3">Upravit: O&nbsp;nás</h2>
      <PageForm key="about" slug="o-nas" :initial="initial" />
    </div>
  </section>
</template>

<style scoped>
.card-wrap{ background:#fff; border:1px solid #e9eaeb; border-radius:12px; padding:16px; }
.fw-extrabold{ font-weight:800; }
</style>
