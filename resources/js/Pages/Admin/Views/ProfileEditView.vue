<!-- resources/js/Pages/Admin/Views/ProfileEditView.vue -->
<script setup>
import ProfileForm from '@/Pages/Admin/Components/ProfileForm.vue'
</script>

<template>
  <section>
    <div class="card-wrap">
      <h2 class="h5 fw-extrabold mt-1 mb-3">Upravit profil</h2>
      <ProfileForm />
    </div>
  </section>
</template>

<style scoped>
.card-wrap{ background:#fff; border:1px solid #e9eaeb; border-radius:12px; padding:16px; }
.fw-extrabold{ font-weight:800; }
</style>
