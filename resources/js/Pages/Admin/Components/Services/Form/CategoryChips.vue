<script setup>
const model = defineModel({ type:String, default:'server' })
const props = defineProps({
  options: { type:Array, required:true } // [{ value, label }]
})

/** klávesová navigace v rámci radiogroupu */
function onKeydown(e){
  if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(e.key)) return
  e.preventDefault()
  const idx = props.options.findIndex(o => o.value === model.value)
  if (e.key === 'Home') { model.value = props.options[0]?.value ?? model.value; return }
  if (e.key === 'End')  { model.value = props.options.at(-1)?.value ?? model.value; return }
  const dir = (e.key === 'ArrowLeft' || e.key === 'ArrowUp') ? -1 : 1
  const next = (idx + dir + props.options.length) % props.options.length
  model.value = props.options[next]?.value ?? model.value
}
</script>

<template>
  <div
    class="cat-grid"
    role="radiogroup"
    aria-label="Výběr kategorie"
    @keydown="onKeydown"
  >
    <button
      v-for="opt in options" :key="opt.value" type="button"
      class="cat-chip" :class="{ active:model===opt.value }"
      role="radio"
      :aria-checked="model===opt.value"
      :tabindex="model===opt.value ? 0 : -1"
      :title="opt.label"
      @click="model = opt.value"
    >
      {{ opt.label }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.cat-grid{ display:grid; grid-template-columns: repeat(3, 1fr); gap:10px; max-width:540px; margin: 0 auto; }
.cat-chip{ width:100%; height:44px; border:1px solid #e9eaeb; border-radius:12px; background:#fff; display:flex; align-items:center; justify-content:center; font-weight:800; cursor:pointer; transition:.15s; }
.cat-chip:hover{ background:#f8fafc; transform: translateY(-1px); }
.cat-chip.active{ background: color-mix(in srgb, var(--Accent) 8%, #fff); border-color: color-mix(in srgb, var(--Accent) 40%, transparent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--Accent) 16%, transparent); color:#0f172a; }
</style>
