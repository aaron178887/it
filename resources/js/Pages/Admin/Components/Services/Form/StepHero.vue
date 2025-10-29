<!-- resources/js/Pages/Admin/Components/Services/Form/StepHero.vue -->
<script setup>
import DropzoneImage from '@/Ui/DropzoneImage.vue'
const title     = defineModel('title', { type:String, default:'' })
const lead      = defineModel('lead',  { type:String, default:'' })
const imageFile = defineModel('imageFile', { default:null })
const imageUrl  = defineModel('imageUrl',  { type:String, default:'' })
const remove    = defineModel('remove',    { type:Boolean, default:false })

const props = defineProps({ mode:{ type:String, default:'create' }, valid:{ type:Boolean, default:false } })
const emit = defineEmits(['prev','next'])
</script>

<template>
  <div class="form-grid full">
    <div class="mb-3">
      <label class="form-label">Hero nadpis</label>
      <input v-model="title" class="form-control" placeholder="Nadpis na hero" />
    </div>

    <div class="mb-3">
      <label class="form-label">Hero text</label>
      <textarea v-model="lead" rows="3" class="form-control" placeholder="Krátký úvodní text..."></textarea>
    </div>

    <div class="mb-2">
      <label class="form-label">Hero obrázek</label>
      <DropzoneImage
        v-model:file="imageFile"
        v-model:url="imageUrl"
        :preview-w="320"
        :preview-h="180"
        preview-ratio="16 / 9"
        object-fit="cover"
        placeholder="Přetáhni sem obrázek nebo vyber soubor"
        hint="PNG/JPG/WEBP, ideálně 1600×900px."
      />

      <label v-if="props.mode==='edit'" class="form-check mt-2">
        <input class="form-check-input" type="checkbox" v-model="remove" />
        <span class="form-check-label">Odebrat aktuální hero obrázek</span>
      </label>
    </div>

    <div class="actions">
      <button class="btn btn-light border" @click="$emit('prev')">Zpět</button>
      <button class="btn btn-primary" :disabled="!props.valid" @click="$emit('next')">Pokračovat na „Sekce"</button>
    </div>
  </div>
</template>

<style scoped>
.form-grid.full{ width:100% }
.actions{ display:flex; gap:8px; justify-content:flex-end; margin-top:8px }
</style>
