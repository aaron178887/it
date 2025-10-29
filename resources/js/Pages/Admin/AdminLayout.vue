<!-- resources/js/Pages/Admin/AdminLayout.vue -->
<script setup>
import { Head } from '@inertiajs/vue3'
import AdminSidebar from '@/Pages/Admin/AdminSidebar.vue'
import '@fortawesome/fontawesome-free/css/all.min.css'

const props = defineProps({
  title:        { type: String, default: 'Admin' },
  active:       { type: String, default: '' },      
  flashSuccess: { type: String, default: '' },
  flashError:   { type: String, default: '' },
})

const emit = defineEmits(['select']) 
</script>

<template>
  <Head :title="title" />

  <div class="admin-shell">
    <div class="admin-main">
      <!-- Sidebar (always exactly once, rendered by layout) -->
      <AdminSidebar :active="active" @select="(v) => emit('select', v)" />

      <!-- Main content area -->
      <main class="admin-content">
        <div class="container-fluid py-4">
          <!-- Header / actions -->
          <div class="d-flex align-items-center justify-content-between gap-2 mb-2">
            <h1 class="page-title">{{ title }}</h1>
            <slot name="actions" />
          </div>

          <!-- Flash messages -->
          <div
            v-if="flashSuccess"
            class="alert alert-success"
            role="alert"
            data-flash="success"
          >
            {{ flashSuccess }}
          </div>
          <div
            v-if="flashError"
            class="alert alert-danger"
            role="alert"
            data-flash="error"
          >
            {{ flashError }}
          </div>

          <!-- Routed view content -->
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped lang="scss">
.admin-shell{
  min-height:100vh;
  display:flex;
  flex-direction:column;
  background:var(--bs-light);
}

.admin-main{
  flex:1 1 auto;
  display:grid;
  grid-template-columns:260px 1fr;
  min-height:0;
}

.admin-content{
  min-width:0;
  overflow:auto;
  background:var(--bs-light);
}

.page-title{
  font:800 22px/1.2 "Sora", system-ui, sans-serif;
  margin:0;
}

.alert{
  border-radius:10px;
  padding:10px 12px;
  margin-bottom:12px;
  font-weight:600;
}

.alert-success{
  border:1px solid #cce7d1;
  background:#f2fbf4;
  color:#0f5132;
}

.alert-danger{
  border:1px solid #f4c2c2;
  background:#fff5f5;
  color:#842029;
}

@media (max-width: 992px){
  .admin-main{ grid-template-columns:80px 1fr; }
}
</style>
