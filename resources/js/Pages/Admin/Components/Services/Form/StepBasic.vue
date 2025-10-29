<script setup>
import CategoryChips from '@/Pages/Admin/Components/Services/Form/CategoryChips.vue'
import IconPicker    from '@/Pages/Admin/Components/Services/Form/IconPicker.vue'
import { CATEGORY_OPTS, BASE_SERVICE_PATH } from '@/Helpers/services.constants.js'

const title      = defineModel('title', { type:String, default:'' })
const slug       = defineModel('slug',  { type:String, default:'' })
const category   = defineModel('category', { type:String, default:'server' })
const menuIcon   = defineModel('menuIcon', { type:String, default:'server' })
const useCustom  = defineModel('useCustomSvg', { type:Boolean, default:false })
const customSvg  = defineModel('customSvg', { type:String, default:'' })

const props = defineProps({
  basePath:  { type:String, default: BASE_SERVICE_PATH },
  customUri: { type:String, default:'' },
  valid:     { type:Boolean, default:false },
  // pro zobrazení backend 422 chyb (hlavně slug)
  errors:    { type:Object, default:() => ({}) }
})
const emit = defineEmits(['next'])
</script>

<template>
  <div class="form-grid centered">
    <div class="mb-3">
      <label class="form-label text-center w-100">Název stránky</label>
      <input v-model="title" class="form-control" placeholder="např. VPS server" />
    </div>

    <div class="mb-3">
      <label class="form-label text-center w-100">URL (slug)</label>
      <div class="input-group">
        <span class="input-group-text">{{ basePath }}</span>
        <input
          id="service-slug"
          v-model="slug"
          class="form-control"
          :class="{ 'is-invalid': !!(props.errors?.slug) }"
          placeholder="vps-server"
        />
      </div>
      <div v-if="props.errors?.slug" class="invalid-feedback d-block mt-1">
        {{ props.errors.slug }}
      </div>
    </div>

    <div class="mb-3">
      <label class="form-label text-center w-100">Kategorie</label>
      <CategoryChips v-model="category" :options="CATEGORY_OPTS" />
      <div class="text-muted small mt-1 text-center">Aktuálně: {{ category }}</div>
    </div>

    <div class="mb-3">
      <label class="form-label text-center w-100">Ikona v menu</label>
      <IconPicker
        v-model:value="menuIcon"
        v-model:useCustom="useCustom"
        v-model:customSvg="customSvg"
        :custom-uri="customUri"
      />
    </div>

    <div class="actions center">
      <button class="btn btn-primary" :disabled="!valid" @click="$emit('next')">Pokračovat na „Hero"</button>
    </div>
  </div>
</template>

<style scoped>
.form-grid{ max-width:980px }
.form-grid.centered{ max-width:640px; margin-inline:auto; text-align:center }
.actions{ display:flex; gap:8px; justify-content:center; margin-top:8px }
</style>
