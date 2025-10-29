<!-- resources/js/Pages/Components/Home/Hero.vue -->
<script setup>
import { Link } from '@inertiajs/vue3'

const desktopImg = '/images/home_hero.jpg'
const mobileImg  = '/images/home_hero_mobile.jpg'
</script>

<template>
  <section class="hero">
    <picture>
      <source media="(max-width: 576px)" :srcset="mobileImg"  sizes="100vw" />
      <source media="(min-width: 577px)" :srcset="desktopImg" sizes="100vw" />
      <img
        class="hero-bg"
        :src="desktopImg"
        alt="Servery a cloudová infrastruktura s Kubernetes – IT Globe"
        role="presentation"
        decoding="async"
        fetchpriority="high"
      />
    </picture>

    <!-- OVERLAY CONTENT -->
    <div class="overlay">
      <div class="container d-flex flex-column gap-2 text-center text-white">
        <div>
          <h1 class="display-3 text-white fw-bold">Výkonná IT infrastruktura</h1>
          <p class="fs-5 mb-4">
            VPS, Kubernetes i správa serverů se SLA a dohledem 24/7. <br />
            Vysoká dostupnost, žádné kompromisy.
          </p>
          <div>
            
            <Link class="btn btn-primary rounded-3 p-3 px-5" href="/kontakt" aria-label="Přejít na kontakt">
              Nezávazně poptat
            </Link>
            
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  display: flex;
  height: 700px;
  padding: 64px 8px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 50px !important;
  align-self: stretch;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 60% center; 
  z-index: 0;
}

.overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.7);
  z-index: 1;
}

.overlay .container > div{
  display: grid;
  justify-items: center;
  row-gap: clamp(16px, 2.2vw, 28px);
  text-align: center;
}
.overlay h1, .overlay p, .overlay .btn { margin: 0 !important; }

@media (max-width: 576px) {
  .hero {
    height: 600px;
    padding: 64px 16px;
    gap: 64px;
  }
  .hero-bg { object-position: center; }

  .overlay .container {
    position: relative;
    z-index: 2;
    color: #fff;
    text-align: center;
    padding: 0 8px;
  }
  .overlay .container h1 {
    font-family: "Sora", sans-serif;
    font-size: 40px !important;
    font-weight: 700 !important;
    line-height: 48px !important;
  }
  .overlay .container p {
    font-family: "Plus Jakarta Sans", sans-serif;
    font-size: 18px;
    font-weight: 500;
  }
  .overlay .container .btn {
    font-size: 18px;
    font-weight: 700;
    padding: 14px 28px;
    border-radius: 8px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-bg { display: none; }
  .hero {
    background: url('/images/home_hero.jpg') no-repeat center / cover !important;
  }
}
@media (prefers-reduced-motion: reduce) and (max-width: 576px) {
  .hero {
    background-image: url('/images/home_hero_mobile.jpg') !important;
  }
}
</style>
