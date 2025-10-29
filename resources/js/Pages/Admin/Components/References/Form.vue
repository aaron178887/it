<script setup>
import { reactive, computed, watch, nextTick } from 'vue'
import { useForm, router } from '@inertiajs/vue3'
import DropzoneImage from '@/Ui/DropzoneImage.vue'

const props = defineProps({
  mode:    { type: String, default: 'create' },
  initial: { type: Object, default: () => ({}) }
})

const toForm = (v = {}) => ({
  id:          v?.id ?? null,
  title:       v?.title ?? '',
  description: v?.description ?? '',
  tag:         v?.tag ?? '',
  logoUrl:     v?.logo ?? null,
  logoFile:    null,
})

const form = reactive(toForm(props.initial))

watch(() => props.initial, (v) => {
  Object.assign(form, toForm(v))
}, { immediate: true })

const canSave = computed(() => !!form.title?.trim() && !!form.description?.trim())

// Přepnuto na useForm kvůli chybám 422 + processing
const req = useForm({})

function save(){
  if (!canSave.value || req.processing) return

  const fd = new FormData()
  fd.append('title',       form.title || '')
  fd.append('description', form.description || '')
  fd.append('tag',         form.tag || '')
  fd.append('logo_alt',    (form.title || '').trim())
  if (form.logoFile instanceof File) fd.append('logo_file', form.logoFile)

  const url = props.mode==='edit'
    ? `/admin/references/${form.id}`
    : '/admin/references'

  req
    .transform(() => {
      if (props.mode === 'edit') fd.append('_method','PUT')
      return fd
    })
    .post(url, {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        router.visit('?view=references', { replace:true, preserveScroll:true })
      },
      onError: (errs) => {
        if (errs?.title) {
          nextTick(() => document.querySelector('#ref-title')?.focus())
        }
      }
    })
}
</script>

<template>
  <div class="card-wrap">
    <h3 class="title" :aria-live="'polite'">
      {{ props.mode==='edit' ? 'Upravit referenci' : 'Přidat referenci' }}
    </h3>

    <div class="grid two">
      <div class="mb-2">
        <label class="form-label">Název</label>
        <input
          id="ref-title"
          class="form-control"
          v-model="form.title"
          :class="{ 'is-invalid': !!req.errors.title }"
          placeholder="E-shop v cloudu"
        />
        <div v-if="req.errors.title" class="invalid-feedback d-block">{{ req.errors.title }}</div>
      </div>
      <div class="mb-2">
        <label class="form-label">Štítek (tag)</label>
        <input class="form-control" v-model="form.tag" placeholder="VPS + vyvažování zátěže" />
      </div>
    </div>

    <div class="mb-2">
      <label class="form-label">Popis</label>
      <textarea
        class="form-control"
        rows="5"
        v-model="form.description"
        :class="{ 'is-invalid': !!req.errors.description }"
        placeholder="Krátký popis řešení…"
      />
      <div v-if="req.errors.description" class="invalid-feedback d-block">{{ req.errors.description }}</div>
    </div>

    <div class="mb-2">
      <label class="form-label">Logo (náhled + nahrání)</label>
      <DropzoneImage
        v-model:file="form.logoFile"
        v-model:url="form.logoUrl"
        :preview-w="260"
        :preview-h="120"
        preview-ratio="13 / 6"
        object-fit="contain"
        placeholder="Přetáhni nebo vyber logo"
        hint="PNG/JPG/WEBP/SVG. Nový soubor automaticky nahradí stávající logo."
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
      />
    </div>

    <div class="actions">
      <button class="btn btn-primary" :disabled="!canSave || req.processing" :aria-busy="req.processing" @click="save">
        {{ req.processing ? 'Ukládám…' : (props.mode==='edit' ? 'Uložit změny' : 'Uložit') }}
      </button>
    </div>

    <!-- případné obecné chyby -->
    <div v-if="Object.keys(req.errors).length" class="alert alert-danger mt-3">
      <div v-for="(msg, key) in req.errors" :key="key">{{ msg }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card-wrap{ background:#fff; border:1px solid #e9eaeb; border-radius:12px; padding:16px; }
.title{ margin:0 0 12px; font:800 16px/1 "Sora",system-ui,sans-serif; }
.grid{ display:grid; gap:10px; }
.grid.two{ grid-template-columns: 1fr 1fr; }
@media (max-width:768px){ .grid.two{ grid-template-columns:1fr; } }
.actions{ display:flex; justify-content:flex-end; gap:8px; }
.btn{ cursor:pointer; }
</style>
