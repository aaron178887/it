<!-- resources/js/Pages/About/Hero.vue -->
<script setup>
import { computed } from 'vue'

const props = defineProps({
  hero: {
    type: Object,
    required: true,
    default: () => ({ title: '', subtitle: '', image: '' }),
  },
  counters: {
    type: Array,
    default: () => [],
  },
  overlayOpacity: {
    type: Number,
    default: 0.68, // o trochu tmavší výchozí hodnota
  },
})

const overlayAlpha = computed(() =>
  Math.min(1, Math.max(0, Number(props.overlayOpacity)))
)

/* Inline background přebije stylesheet; CSS var nechávám jako fallback */
const overlayStyle = computed(() => ({
  '--overlay-alpha': String(overlayAlpha.value),
  background: `rgba(0,0,0,${overlayAlpha.value})`,
}))
</script>

<template>
  <section id="intro" class="hero about-hero">
    <!-- Pozadí jako IMG (stabilní poměr) -->
    <img
      v-if="hero.image"
      class="hero-bg about-hero__bg"
      :src="hero.image"
      :alt="hero.title || 'Hero background'"
      aria-hidden="true"
      decoding="async"
      loading="eager"
      fetchpriority="high"
    />

    <!-- Overlay + obsah -->
    <div class="overlay" :style="overlayStyle">
      <div class="container text-center text-white">
        <div class="mx-auto">
          <h1 class="display-3 text-white fw-bold">{{ hero.title }}</h1>
          <p v-if="hero.subtitle" class="fs-5 mb-4">{{ hero.subtitle }}</p>

          <div
            v-if="counters && counters.length"
            class="row g-4 justify-content-between text-start mt-5 about-hero__stats"
          >
            <div v-for="(c, i) in counters" :key="i" class="col-12 col-md-4">
              <div class="border-start border-3 border-primary ps-2">
                <h2 class="mb-0">{{ c.value }}</h2>
                <p class="mb-0">{{ c.label }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about-hero {
  position: relative;
  overflow: hidden;
}

.about-hero__bg { aspect-ratio: 12 / 5; }

.about-hero > .hero-bg {
  display: block !important;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.about-hero > .overlay {
  position: absolute !important;
  inset: 0 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  /* bez !important, aby šel přepsat inline stylem */
  background: rgba(0, 0, 0, var(--overlay-alpha, .45));
  z-index: 1 !important;
}

.about-hero h1,
.about-hero p {
  text-shadow: 0 1px 2px rgba(0,0,0,.25);
}

.about-hero .container { position: relative; z-index: 2; }

@media (max-width: 576px) {
  .about-hero > .overlay {
    padding-top: clamp(68px, 10vh, 96px) !important;
    padding-bottom: 16px !important;
  }
  .about-hero .container {
    padding-left: 12px;
    padding-right: 12px;
    display: grid;
    justify-items: center;
    row-gap: clamp(14px, 2.4vw, 22px);
    text-align: center;
  }
  .about-hero .container > .mx-auto > * { margin: 0 !important; }
  .about-hero__stats { margin-top: 1rem !important; text-align: center; }
}
</style>
