<!-- resources/js/Pages/Components/Contact/Hero.vue -->
<script setup>
import { computed } from 'vue'

const props = defineProps({
  hero: {
    type: Object,
    required: true,
    default: () => ({ title: '', subtitle: '', image: '' })
  }
})


function scrollToForm(e) {
  e.preventDefault()
  const el = document.querySelector('#contact-form')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    history.replaceState(null, '', '#contact-form')
  }
}

/** Bezpečné vložení URL do CSS url() */
function cssEscapeUrl(u = '') {
  return String(u).replace(/["\\)]/g, '\\$&')
}
const heroStyle = computed(() =>
  props.hero?.image ? { '--HeroImg': `url("${cssEscapeUrl(props.hero.image)}")` } : {}
)
</script>

<template>
  <section class="contact-hero" :style="heroStyle" aria-label="Hero">
    <div class="overlay">
      <div class="container text-white">
        <div class="hero-stack text-center">
          <h1 class="contact-hero__title fw-800">
            {{ hero.title || 'Kontaktujte nás' }}
          </h1>

          <p class="contact-hero__lead">
            {{ hero.subtitle || 'Neváhejte nás kontaktovat – jsme tu pro vás 24/7.' }}
          </p>

          <a href="#contact-form" class="btn btn-primary rounded-3 p-3 px-5" @click="scrollToForm">
            Napište nám
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact-hero {
  position: relative;
  min-height: 72vh;
  display: block;
  background: var(--HeroImg, none) center / cover no-repeat;
}

.contact-hero .overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  z-index: 0;
  padding-top: clamp(96px, 14vh, 160px);
  padding-bottom: clamp(16px, 6vh, 48px);
}

.contact-hero .container {
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
.hero-stack > * { margin: 0; }

.contact-hero__title {
  font-family: 'Sora', sans-serif;
  font-weight: 800;
  font-size: clamp(2rem, 5vw, 3rem);
  line-height: 1.1;
  color: #fff;
}

.contact-hero__lead {
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-size: clamp(1rem, 2.2vw, 1.25rem);
  line-height: 1.6;
  color: #fff;
  opacity: .96;
}

@media (max-width: 992px) {
  .contact-hero { min-height: 64vh; }
  .contact-hero .overlay {
    padding-top: clamp(80px, 12vh, 120px);
    padding-bottom: clamp(16px, 5vh, 40px);
  }
}


@media (max-width: 576px) {
  .contact-hero {
    height: 60vh;      
    min-height: unset; 
  }
  .contact-hero .overlay {
    padding-top: 12vh; 
    padding-bottom: 6vh;
  }

  .contact-hero__lead {
    font-size: 1.2rem;
    line-height: 1.6;
  }

  .hero-stack {
    row-gap: 24px;
  }
}
</style>
