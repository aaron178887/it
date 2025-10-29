<script setup>
import { Link } from '@inertiajs/vue3'
</script>

<template>
  <section class="py-5 contact-action">
    <div class="container d-flex flex-column gap-2 text-center text-md-start">
      <div class="col-md-10 mx-auto text-center py-5 bg-cta-grad px-4 text-white rounded-4 cta-box">
        <div class="opacity-75 mb-2 cta-eyebrow">Přidejte se k těmto úspěšným značkám</div>

        <div class="d-flex gap-2 justify-content-center mb-3 ref-badges" aria-label="Reference">
          <!-- GitHub -->
          <span class="logo-tile" role="img" aria-label="GitHub">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="28" height="28" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
            </svg>
          </span>

          <!-- Vercel -->
          <span class="logo-tile" role="img" aria-label="Vercel">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
              <polygon points="12,3 22,21 2,21"/>
            </svg>
          </span>

          <!-- Slack -->
          <span class="logo-tile" role="img" aria-label="Slack">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
              <rect x="2" y="7" width="20" height="3.5" rx="1.75"/>
              <rect x="2" y="13.5" width="20" height="3.5" rx="1.75"/>
              <rect x="7" y="2" width="3.5" height="20" rx="1.75"/>
              <rect x="13.5" y="2" width="3.5" height="20" rx="1.75"/>
            </svg>
          </span>

          <!-- Spotify -->
          <span class="logo-tile" role="img" aria-label="Spotify">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="9.5"/>
              <path d="M6.5 9.25c3.5-1.15 7.5-1.05 10.9.35"/>
              <path d="M7 12.2c2.8-.85 5.8-.75 8.4.25"/>
              <path d="M7.5 14.9c2.1-.65 4.2-.55 6 .25"/>
            </svg>
          </span>
        </div>

        <h2 class="fs-1 fw-bold mb-1 cta-title">Chcete posunout své IT dál?</h2>
        <p class="opacity-75 mb-4 cta-desc">Kontaktujte nás a společně najdeme ideální řešení pro váš byznys.</p>

        <div>
          <Link class="btn-cta" href="/kontakt" aria-label="Přejít na kontakt">Kontaktujte nás</Link>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>

@media (max-width: 576px) {
  .cta-box {
    width: 100%;
    max-width: 358px;
    margin: 0 auto;
    height: auto;
    padding: 28px 20px; 
    text-align: center;
    position: static;
  }

  .cta-eyebrow {
    color: var(--Base-300, #D5D7DA);
    text-align: center;
    font-family: "Plus Jakarta Sans";
    font-size: 12px;
    font-weight: 500; 
    margin-bottom: 12px !important;
  }

  .ref-badges { margin-bottom: 20px !important; }

  .cta-title {
    color: var(--White, #FFF);
    font-family: Sora;
    font-size: 40px;
    font-weight: 700;
    line-height: 42px !important; 
    margin-top: 20px !important;
    margin-bottom: 16px !important;
  }

  .cta-desc {
    color: var(--Base-300, #D5D7DA);
    text-align: center;
    font-family: "Plus Jakarta Sans";
    font-size: 18px;
    font-weight: 500; 
    margin-bottom: 28px !important; 
  }

  .btn-cta {
    display: inline-block;
  }
}
</style>
