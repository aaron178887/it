<script setup>
import { nextTick } from 'vue'
import SectionCard from '@/Pages/Admin/Components/Services/SectionCard.vue'

const sections = defineModel({ type:Array, default:() => [] })
defineProps({ mode:{ type:String, default:'create' } })
const emit  = defineEmits(['add','insert-below','remove','up','down','prev','next'])

const FOCUS_OFFSET = 120

function focusSection(id){
  nextTick(() => {
    const el = document.querySelector(`[data-sid="${id}"]`)
    if (!el) return
    el.focus?.({ preventScroll: true })
    const rect = el.getBoundingClientRect()
    const targetTop = window.pageYOffset + rect.top - FOCUS_OFFSET
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    window.scrollTo({ top: Math.max(0, targetTop), behavior: reduce ? 'auto' : 'smooth' })
  })
}

function onUp(idx){ const id = sections.value[idx]?.id; emit('up', idx); if (id) focusSection(id) }
function onDown(idx){ const id = sections.value[idx]?.id; emit('down', idx); if (id) focusSection(id) }
function onInsertBelow(idx){
  emit('insert-below', idx)
  nextTick(() => { const newItem = sections.value[idx+1]; if (newItem?.id) focusSection(newItem.id) })
}
function onRemove(idx){
  const next = sections.value[idx+1]?.id ?? sections.value[idx-1]?.id
  emit('remove', idx)
  if (next) focusSection(next)
}
</script>

<template>
  <div class="form-grid full">
    <div class="d-flex align-items-center justify-content-between mb-2">
      <h3 class="mb-0 h6 fw-extrabold">Sekce ({{ sections.length }})</h3>
      <button type="button" class="btn btn-primary btn-sm" @click="$emit('add')">
        <i class="fa-solid fa-plus me-1"></i> Přidat sekci
      </button>
    </div>

    <div v-for="(s,i) in sections" :key="s.id" class="mb-3">
      <SectionCard
        v-model="sections[i]"
        :index="i"
        :total="sections.length"
        @moveUp="onUp"
        @moveDown="onDown"
        @insertBelow="onInsertBelow"
        @remove="onRemove"
      />
      <hr class="my-3" />
    </div>

    <div class="actions">
      <button class="btn btn-light border" @click="$emit('prev')">Zpět</button>
      <button class="btn btn-primary" :disabled="!sections.length" @click="$emit('next')">Pokračovat na „Výhody"</button>
    </div>
  </div>
</template>

<style scoped>
.form-grid.full{ width:100% }
.actions{ display:flex; gap:8px; justify-content:flex-end; margin-top:8px }
.fw-extrabold{ font-weight:800 }
</style>
