<!-- resources/js/Pages/Components/Home/Services.vue -->
<template>
  <section class="services">
    <div class="container d-flex flex-column gap-2">
      <div class="col-md-7 mx-auto text-center mb-4">
        <h2 class="section-title">Výkonná IT infrastruktura pro náročné</h2>
        <p class="section-desc">
          Naše služby pomáhají firmám ve výrobě, obchodu i službách fungovat spolehlivě, bezpečně a bez výpadků.
        </p>
      </div>

      <div class="row g-2 row-cols-1 row-cols-sm-2">
        <!-- VPS -->
        <div class="col">
          <article class="service-card">
            <h3 class="service-card__title">VPS servery</h3>
            <p class="service-card__desc">
              Bleskově rychlé virtuální servery s okamžitým nasazením, plným root přístupem a škálováním pro rostoucí byznys.
            </p>
            <div>
              <Link class="btn-ghost-accent" href="/sluzby/vps" aria-label="VPS servery – detail služby">
                Zjistit více
              </Link>
            </div>
            <img
              :src="'/images/home/services_vps.png'"
              alt="VPS servery"
              class="service-card__image"
              loading="lazy"
            />
          </article>
        </div>

        <!-- Managed / Spravované servery -->
        <div class="col">
          <article class="service-card">
            <h3 class="service-card__title">Managed servery</h3>
            <p class="service-card__desc">
              Managed servery s nepřetržitým monitoringem, aktualizacemi a technickým dohledem.
            </p>
            <div>
              <Link class="btn-ghost-accent" href="/sluzby/spravovane-servery" aria-label="Spravované servery – detail služby">
                Zjistit více
              </Link>
            </div>
            <img
              :src="'/images/home/services_managed.jpg'"
              alt="Spravované servery"
              class="service-card__image"
              loading="lazy"
            />
          </article>
        </div>

        <!-- Kubernetes -->
        <div class="col">
          <article class="service-card">
            <h3 class="service-card__title">Kubernetes</h3>
            <p class="service-card__desc">
              Orchestrace kontejnerových aplikací, nasazování, škálování a správa prostředí včetně CI/CD.
            </p>
            <div>
              <Link class="btn-ghost-accent" href="/sluzby/kubernetes" aria-label="Kubernetes – detail služby">
                Zjistit více
              </Link>
            </div>
            <img
              :src="'/images/home/services_kubernetes.jpg'"
              alt="Služby Kubernetes"
              class="service-card__image"
              loading="lazy"
            />
          </article>
        </div>

        <!-- Aplikace (firemní aplikace) -->
        <div class="col">
          <article class="service-card">
            <h3 class="service-card__title">Aplikace</h3>
            <p class="service-card__desc">
              Firemní aplikace včetně hostingu, vývoje a správy – bezpečně a bez starostí.
            </p>
            <div>
              <Link class="btn-ghost-accent" href="/sluzby/firemni-aplikace" aria-label="Firemní aplikace – detail služby">
                Zjistit více
              </Link>
            </div>
            <img
              :src="'/images/home/services_application.png'"
              alt="Firemní aplikace"
              class="service-card__image"
              loading="lazy"
            />
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Link } from '@inertiajs/vue3'
</script>

<style lang="scss" scoped>
</style>
