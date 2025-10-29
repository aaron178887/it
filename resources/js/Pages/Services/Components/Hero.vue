<!-- resources/js/Pages/Services/Components/Hero.vue -->
<script setup>
import { computed } from 'vue'

const props = defineProps({
  hero: { type: Object, default: () => ({}) },
  title:    { type: String, default: null },
  lead:     { type: String, default: null },
  image:    { type: [String, Object], default: null },
  ctaLabel: { type: String, default: null },
  ctaHref:  { type: String, default: null },
})

const heroTitle = computed(() =>
  props.hero?.title ?? props.title ?? 'VPS server'
)
const heroLead = computed(() =>
  props.hero?.lead ?? props.lead ?? 'Vyladěný a bezpečný hosting pro vaše aplikace a projekty'
)

const heroImageUrl = computed(() => {
  const v = props.hero?.image ?? props.image
  if (!v) return null
  if (typeof v === 'string') return v
  if (v && typeof v === 'object' && typeof v.src === 'string') return v.src
  return null
})

const ctaLabel = computed(() =>
  props.hero?.ctaLabel ?? props.ctaLabel ?? 'Zjistit více'
)
const ctaHref = computed(() =>
  props.hero?.ctaHref ?? props.ctaHref ?? '#learn'
)

function cssEscapeUrl(u = '') {
  return String(u).replace(/["\\)]/g, '\\$&')
}
const heroStyle = computed(() =>
  heroImageUrl.value ? { '--HeroImg': `url("${cssEscapeUrl(heroImageUrl.value)}")` } : {}
)
</script>

<template>
  <section
    class="services-hero services-hero--services-server"
    :style="heroStyle"
    id="intro"
    aria-label="Hero"
  >
    <div class="overlay">
      <div class="container text-white">
        <div class="hero-stack text-center">
          <h1 class="services-hero__title fw-800">{{ heroTitle }}</h1>
          <p class="services-hero__lead">{{ heroLead }}</p>
          <a :href="ctaHref" class="btn btn-primary rounded-3 p-3 px-5">
            {{ ctaLabel }}
          </a>
        </div>
      </div>
    </div>

    <noscript v-if="heroImageUrl">
      <img :src="heroImageUrl" alt="" style="display:none" />
    </noscript>
  </section>
</template>

<style scoped>

.services-hero {
  position: relative;
  min-height: 72vh;
  display: block;
  background: var(--HeroImg, none) center / cover no-repeat;
}

.services-hero > .overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 0;
  padding-top: clamp(96px, 14vh, 160px);
  padding-bottom: clamp(16px, 6vh, 48px);
}

.services-hero .container {
  position: relative;
  z-index: 1;
  padding-left: 12px;
  padding-right: 12px;
}

.hero-stack {
  display: grid;
  justify-items: center;
  row-gap: clamp(16px, 2.2vw, 28px);
  text-align: center;
}
.hero-stack > * { margin: 0 !important; }

.services-hero__title {
  line-height: 1.1;
  font-family: 'Sora', sans-serif;
  font-weight: 800;
  font-size: clamp(2rem, 5vw, 3rem);
  color: #fff;
}
.services-hero__lead {
  font-size: clamp(1rem, 2.2vw, 1.25rem);
  line-height: 1.6;
  color: #fff;
  opacity: .96;
}

/* ===== Tablet ===== */
@media (max-width: 992px) {
  .services-hero { min-height: 64vh; }
  .services-hero > .overlay {
    padding-top: clamp(80px, 12vh, 120px);
    padding-bottom: clamp(16px, 5vh, 40px);
  }
}

/* ===== Mobile – JEN TADY jsou změny: větší odstavec + lehce větší mezery ===== */
@media (max-width: 576px) {
  .services-hero { min-height: 58vh; }
  .services-hero > .overlay {
    padding-top: clamp(72px, 11vh, 110px);
    padding-bottom: clamp(12px, 4vh, 32px);
  }

  /* větší p – cca 19px; držíme příjemnou čitelnost */
  .services-hero__lead {
    font-size: 1.1875rem; /* 19px při base 16px */
    line-height: 1.65;
  }

  /* o fous větší rozestup mezi H1, P a tlačítkem */
  .hero-stack {
    row-gap: 22px;
  }
}
</style>
