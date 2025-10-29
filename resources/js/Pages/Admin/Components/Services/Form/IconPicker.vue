<script setup>
import { ICON_SVGS, ICONS } from '@/Helpers/icons.js'
import { sanitizeSvg } from '@/Helpers/sanitizeSvg.js'

const model        = defineModel('value', { type:String,  default:'server' })
const useCustomSvg = defineModel('useCustom', { type:Boolean, default:false })
const customSvg    = defineModel('customSvg', { type:String,  default:'' })

defineProps({
  customUri: { type:String, default:'' }
})

function choose(v){
  model.value = v
  useCustomSvg.value = (v === '__custom')
}
</script>

<template>
  <div class="icon-grid" role="listbox" aria-label="Výběr ikony">
    <button
      v-for="opt in ICONS" :key="opt.value" type="button"
      class="icon-chip" :class="{ active: model===opt.value }"
      :aria-selected="model===opt.value" role="option"
      :title="opt.label"
      @click="choose(opt.value)"
    >
      <span class="svg" v-html="ICON_SVGS[opt.value]"></span>
    </button>

    <button
      type="button" class="icon-chip" :class="{ active:model==='__custom' }"
      title="Vlastní SVG" role="option" :aria-selected="model==='__custom'"
      @click="choose('__custom')"
    >
      <span class="svg" v-if="customUri" v-html="sanitizeSvg(customUri)"></span>
      <span v-else class="text-muted">+</span>
    </button>
  </div>

  <label class="form-check mt-3 text-center custom-svg-click">
    <input
      class="form-check-input"
      type="checkbox"
      v-model="useCustomSvg"
      @change="model = useCustomSvg ? '__custom' : 'server'"
    />
    <span class="form-check-label">Chci nahrát vlastní SVG</span>
  </label>

  <textarea
    v-if="useCustomSvg"
    v-model="customSvg"
    class="form-control mt-2 mono"
    rows="5"
    placeholder="<svg ...>…</svg>"
  />
  <div v-if="useCustomSvg && customUri" class="mt-2 p-2 border rounded">
    <div class="small text-muted mb-1">Náhled:</div>
    <div class="svg-preview" v-html="sanitizeSvg(customUri)"></div>
  </div>
</template>

<style scoped lang="scss">
.icon-grid{ display:grid; grid-template-columns: repeat(auto-fit, minmax(52px, 1fr)); gap:10px; width:100%; }
.icon-chip{ width:100%; height:52px; padding:0; border:1px solid #e9eaeb; border-radius:12px; background:#fff; display:flex; align-items:center; justify-content:center; color:#111827; cursor:pointer; transition:.15s; }
.icon-chip:hover{ background-color:#f8fafc; transform: translateY(-1px); }
.icon-chip.active{ background-color: color-mix(in srgb, var(--Accent) 8%, #fff); border-color: color-mix(in srgb, var(--Accent) 40%, transparent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--Accent) 16%, transparent); color:#0f172a; }
.icon-chip .svg :deep(svg){ width:24px; height:24px; display:block; stroke: currentColor !important; fill: none; }
.mono{ font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace; }
.svg-preview :deep(svg){ width:32px; height:32px; color:#6b7280; }
</style>
