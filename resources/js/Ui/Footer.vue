<!-- resources/js/Pages/Components/Footer.vue -->
<script setup>
import { computed } from 'vue'
import { Link } from '@inertiajs/vue3'
import { useNavServices } from '@/Helpers/navServices.js'

// čteme sloupce jen z helperu (pořadí + popisky ze services.constants.js)
const { cols } = useNavServices()

// odfiltrujeme prázdné sloupce už ve scriptu (kvůli Vue diffu)
const visibleCols = computed(() =>
  (cols.value ?? []).filter(c => Array.isArray(c.items) && c.items.length > 0)
)

const mainLinks = [
  { label: 'Úvod',       href: '/' },
  { label: 'Reference',  href: '/reference' },
  { label: 'O nás',      href: '/o-nas' },
  { label: 'Kontakt',    href: '/kontakt' },
]
</script>

<template>
  <footer class="site-footer text-white" role="contentinfo">
    <div class="container">
      <div class="row g-3 align-items-start justify-content-center justify-content-md-between">

        <!-- Značka + text + sociální sítě -->
        <div class="col-lg-4 pe-lg-5 footer-brand">
          <Link class="d-inline-block mb-3" href="/" aria-label="Domů">
            <img class="img-fluid footer-logo" :src="'/images/logo.png'" alt="Logo společnosti" loading="lazy" />
          </Link>

          <p class="footer-text mb-3">
            Jsme odborníci na cloud a IT. Dodáváme spolehlivá řešení pro váš byznys s podporou 24/7.
          </p>

          <nav class="footer-social mb-3" aria-label="Sociální sítě">
            <ul class="list-unstyled d-flex gap-2 mb-0">
              <li>
                <a class="footer-social-link" href="https://facebook.com/yourpage" target="_blank" rel="noopener" aria-label="Facebook">
                  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" role="img">
                    <path d="M22.675 0H1.325C.593 0 0 .593 0 1.326v21.348C0 23.407.593 24 1.325 24h11.494v-9.294H9.847v-3.62h2.972V8.413c0-2.943 1.796-4.548 4.418-4.548 1.257 0 2.337.093 2.652.135v3.074h-1.82c-1.428 0-1.704.678-1.704 1.673v2.195h3.407l-.444 3.62h-2.963V24h5.809C23.407 24 24 23.407 24 22.674V1.326C24 .593 23.407 0 22.675 0z"/>
                  </svg>
                  <span class="sr-only">Facebook</span>
                </a>
              </li>
              <li>
                <a class="footer-social-link" href="https://linkedin.com/company/yourpage" target="_blank" rel="noopener" aria-label="LinkedIn">
                  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" role="img">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.036-1.85-3.036-1.853 0-2.136 1.447-2.136 2.941v5.664H9.353V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.369-1.85 3.604 0 4.268 2.373 4.268 5.459v6.282zM5.337 7.433a2.064 2.064 0 1 1 0-4.128 2.064 2.064 0 0 1 0 4.128zM7.115 20.452H3.556V9h3.559v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.454C23.2 24 24 23.226 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
                  </svg>
                  <span class="sr-only">LinkedIn</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <!-- Sloupec: Přehled -->
        <div class="col-6 col-md-3 col-lg-2">
          <div class="footer-col">
            <h3 class="footer-heading">Přehled</h3>
            <ul class="list-unstyled d-flex flex-column gap-2 mb-0">
              <li v-for="l in mainLinks" :key="l.href">
                <Link class="footer-link" :href="l.href">{{ l.label }}</Link>
              </li>
            </ul>
          </div>
        </div>

        <!-- Servery / Aplikace / Kontejnery (jen z helperu, bez duplicit) -->
        <div
          class="col-6 col-md-3 col-lg-2"
          v-for="col in visibleCols"
          :key="col.key"
        >
          <div class="footer-col">
            <h3 class="footer-heading">{{ col.title }}</h3>
            <ul class="list-unstyled d-flex flex-column gap-2 mb-0">
              <li v-for="(it, i) in col.items" :key="`${col.key}-${it.slug || it.href || i}`">
                <Link class="footer-link" :href="it.href">{{ it.title }}</Link>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  </footer>
</template>
<style scoped>

.footer-brand .footer-logo{
  display: block;
  height: auto;
  width: auto;
  max-height: 28px;        
  object-fit: contain;
  image-rendering: -webkit-optimize-contrast;
}
@media (max-width: 576px){
  .footer-brand .footer-logo{
    max-height: 22px;      
  }
}

/* Ikony sociálních sítí */
.footer-social-link svg {
  display: block;
  width: 1.25rem;
  height: 1.25rem;
}

/* Screen-reader only text */
.sr-only {
  position: absolute; width:1px; height:1px; padding:0; margin:-1px;
  overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0;
}

/* === Mobil: menší mezera nad sociálními ikonami === */
@media (max-width: 576px) {
  .footer-brand { margin-top: 12px !important; }
  .footer-social { margin-top: 8px !important; margin-bottom: 16px !important; }
}
</style>
