<!-- resources/js/Pages/Admin/Index.vue -->
<script setup>
import { computed, onMounted } from 'vue'
import { usePage, router } from '@inertiajs/vue3'

import AdminLayout from '@/Pages/Admin/AdminLayout.vue'

import ServiceCreateView   from '@/Pages/Admin/Views/ServiceCreateView.vue'
import ServicesIndexView   from '@/Pages/Admin/Views/ServiceIndexView.vue'
import ReferencesIndexView from '@/Pages/Admin/Views/ReferenceIndexView.vue'
import AboutEditView       from '@/Pages/Admin/Views/AboutEditView.vue'
import ContactEditView     from '@/Pages/Admin/Views/ContactEditView.vue'
import ProfileEditView     from '@/Pages/Admin/Views/ProfileEditView.vue'

const props = defineProps({
  services:   { type: Array,  default: () => [] },
  service:    { type: Object, default: null },
  about:      { type: Object, default: null },
  contact:    { type: Object, default: null },
  references: { type: Array,  default: () => [] },
  reference:  { type: Object, default: null },
  // server může poslat 'mode' pro sekci references ('list' | 'create' | 'edit')
  mode:       { type: String, default: 'list' },
})

const page = usePage()

const query  = computed(() => {
  const url = page.url || ''
  const qs  = url.includes('?') ? url.split('?')[1] : ''
  return new URLSearchParams(qs)
})
const view   = computed(() => query.value.get('view') || 'service')

// id je pouze číslo → jinak null
const editId = computed(() => {
  const raw = query.value.get('id')
  return raw && /^\d+$/.test(raw) ? Number(raw) : null
})

// klientská záloha z URL (když server neposlal props.mode)
const urlMode = computed(() => query.value.get('mode') === 'create' ? 'create' : 'list')

const TITLES = {
  addService: 'Přidat stránku',
  service:    'Stránky',
  references: 'Reference',
  about:      'O nás',
  contact:    'Kontakt',
  profile:    'Upravit profil',
}
const pageTitle = computed(() => TITLES[view.value] || 'Admin')

function setView (v) {
  router.visit(`?view=${v}`, { replace: true, preserveScroll: true })
}

const flashSuccess = computed(() => page.props?.flash?.success || '')
const flashError   = computed(() => page.props?.flash?.error   || '')
onMounted(() => {
  const ok = document.querySelector('[data-flash="success"]')
  const er = document.querySelector('[data-flash="error"]')
  if (ok) setTimeout(() => ok.remove(), 3500)
  if (er) setTimeout(() => er.remove(), 5000)
})

const VIEW_REGISTRY = {
  addService: { comp: ServiceCreateView,   pick: () => ({}) },
  service:    { comp: ServicesIndexView,   pick: (p) => ({ services: p.services, service: p.service, editId: editId.value }) },
  references: { comp: ReferencesIndexView, pick: (p) => ({
    references: p.references,
    reference:  p.reference,
    editId:     editId.value,
    mode:       p.mode ?? urlMode.value, // preferuj server, jinak URL
  }) },
  about:      { comp: AboutEditView,       pick: (p) => ({ about: p.about }) },
  contact:    { comp: ContactEditView,     pick: (p) => ({ contact: p.contact }) },
  profile:    { comp: ProfileEditView,     pick: () => ({}) },
}
const CurrentView  = computed(() => VIEW_REGISTRY[view.value]?.comp || ServicesIndexView)
const currentProps = computed(() => VIEW_REGISTRY[view.value]?.pick(props) || { services: props.services })

// vynutíme remount při změně view/id/mode
const viewKey = computed(() => `${view.value}:${editId.value ?? ''}:${(urlMode.value || props.mode)}`)
</script>

<template>
  <AdminLayout
    :title="pageTitle"
    :active="view"
    :flash-success="flashSuccess"
    :flash-error="flashError"
    @select="setView"
  >
    <template #actions>
      <button
        v-if="view === 'service' && !editId"
        class="btn btn-primary btn-sm"
        @click="router.visit('?view=addService',{replace:true,preserveScroll:true})"
      >
        Přidat stránku
      </button>

      <button
        v-else-if="view === 'references' && !editId"
        class="btn btn-primary btn-sm"
        @click="router.visit('?view=references&mode=create',{replace:true,preserveScroll:true})"
      >
        Přidat referenci
      </button>
    </template>

    <component :is="CurrentView" :key="viewKey" v-bind="currentProps" />
  </AdminLayout>
</template>
