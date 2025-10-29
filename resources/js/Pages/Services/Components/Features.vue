<!-- resources/js/Components/Services/Features.vue -->
<script setup>
import { computed } from 'vue'
import { ICON_SVGS as ICONS } from '@/Helpers/icons.js'

const props = defineProps({
  heading: { type: String, default: 'Benefity' },
  items:   { type: Array, default: () => [] }, // [{ title, text, icon }]
})

/** Vrátí inline <svg> — buď přímo z props, nebo podle klíče z ICONS. */
const iconSvg = (name) => {
  const raw = (name ?? '').toString().trim()
  if (raw.startsWith('<svg')) return raw
  return ICONS[raw] || ICONS.bolt
}

const normalizedItems = computed(() =>
  (props.items || []).map(it => ({
    title: String(it?.title ?? ''),
    text:  String(it?.text  ?? ''),
    icon:  String(it?.icon  ?? 'bolt'),
  })).filter(it => it.title || it.text)
)
</script>

<template>
  <section class="py-5 services-features" id="learn" :aria-label="heading || 'Benefity'">
    <div class="container d-flex flex-column gap-2">
      <h2 class="fs-1 fw-bold mb-4 text-center">{{ heading }}</h2>

      <div v-if="normalizedItems.length" class="p-3 bg-secondary rounded-3">
        <div class="row m-0 row-cols-1 row-cols-sm-2 row-cols-lg-3 g-2">
          <div v-for="(it, idx) in normalizedItems" :key="idx" class="col d-flex">
            <div class="border p-2 w-100 d-flex">
              <div class="feature-row d-flex flex-column flex-md-row align-items-start gap-3 p-2 w-100">
                <div class="ico-wrap" aria-hidden="true" v-html="iconSvg(it.icon)"></div>
                <div class="d-flex flex-column">
                  <h5 class="fw-bold mb-1">{{ it.title }}</h5>
                  <p class="small mb-0 feature-text clamp-3">{{ it.text }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
.ico-wrap{
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: #fff;
  border: 1px solid rgba(0,0,0,.06);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--Accent, #F52130);
  flex: 0 0 48px;
}
.ico-wrap :deep(svg){ width: 20px; height: 20px; display: block; }

.feature-row{ align-items: flex-start; }

.feature-text{
  overflow-wrap:anywhere;
  word-break:break-word;
  hyphens:auto;
}
.clamp-3{
  display:-webkit-box;
  -webkit-box-orient:vertical;
  -webkit-line-clamp:3;
  overflow:hidden;
}
</style>
