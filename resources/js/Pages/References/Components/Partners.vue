<!-- resources/js/Pages/Components/Reference/Partners.vue -->
<script setup>
import { computed } from 'vue'

const props = defineProps({
  items: { type: Array, default: () => [] },
})

const cards = computed(() =>
  (props.items || []).map(r => ({
    id:    r.id ?? null,
    logo:  r.logo ?? '',
    alt:   r.logo_alt || (r.title ? `Logo klienta – ${r.title}` : 'Logo klienta'),
    title: r.title ?? '',
    desc:  r.description ?? '',
    tag:   r.tag ?? '',
  }))
)
</script>

<template>
  <section class="py-5 refs-partners">
    <div class="container">
      <!-- Hlavička -->
      <div class="section-head col-md-7 mx-auto text-center mb-4">
        <h2 class="section-title">Naši partneři</h2>
        <p class="section-desc">
          Podívejte se, jak jsme pomohli našim partnerům se správou jejich infrastruktury.
        </p>
      </div>

      <!-- GRID -->
      <div v-if="cards.length" class="row g-3 justify-content-center">
        <div
          v-for="c in cards"
          :key="c.id ?? c.title"
          class="col-11 col-sm-6 col-md-4"
        >
          <article class="ref-card">
            <div class="logo-wrap">
              <img
                :src="c.logo"
                :alt="c.alt"
                class="img-fluid grayed-out"
                loading="lazy"
                decoding="async"
              />
            </div>

            <h4 class="ref-title">{{ c.title }}</h4>
            <p v-if="c.desc" class="ref-desc">{{ c.desc }}</p>

            <div v-if="c.tag" class="tag-box">
              <span class="tag-text">{{ c.tag }}</span>
            </div>
          </article>
        </div>
      </div>

      <div v-else class="text-center text-muted py-4">
        Zatím žádné reference.
      </div>
    </div>
  </section>
</template>

<style scoped>

:where(.refs-partners){
  --black: var(--Black, #111);
  --base-700: var(--Base-700, #667085);
  --base-300: var(--Base-300, #D5D7DA);
  --base-200: var(--Base-200, #E9EAEB);
  --base-100: var(--Base-100, #F5F5F5);
  --accent: var(--Accent, #F52130);
  --font-head: "Sora", system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
  --font-body: "Plus Jakarta Sans", system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
}

.refs-partners .section-head .section-title{
  color: var(--black);
  text-align: center;
  font-family: var(--font-head);
  font-size: 48px;
  font-weight: 700;
  line-height: 52px;
  margin-bottom: 28px;
}

.refs-partners .section-head .section-desc{
  color: var(--base-700);
  text-align: center;
  font-family: var(--font-body);
  font-size: 18px;
  font-weight: 500;
  margin: 0;
  max-width: 820px;
  margin-left: auto;
  margin-right: auto;
}

.refs-partners .ref-card{
  display: flex;
  padding: 24px;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px; 
  flex: 1 0 0;
  border-radius: 8px;
  border: 1px solid var(--base-300);
  background: var(--base-200);
  height: 100%;
}

.refs-partners .ref-card .logo-wrap{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 160px;
  padding: 0 89px;
  border-radius: 8px;
  background: #fff;
}

.refs-partners .ref-card .ref-title{
  color: var(--black);
  font-family: var(--font-head);
  font-size: 24px;
  font-weight: 700;
  line-height: 28px;
  margin: 8px 0 16px !important;
  text-align: left;
}

.refs-partners .ref-card .ref-desc{
  color: var(--base-700);
  font-family: var(--font-body);
  font-size: 16px;
  font-weight: 500;
  margin: 0;
  text-align: left;
}

.refs-partners .ref-card .tag-box{
  display: flex;
  padding: 12px 20px;
  align-items: center;
  gap: 8px;
  align-self: stretch;
  border-radius: 8px;
  background: var(--base-100);
}

.refs-partners .ref-card .tag-text{
  color: var(--accent);
  font-family: var(--font-body);
  font-size: 16px;
  font-weight: 700;
}

.page-references .refs-partners .ref-card > h4.ref-title{
  margin-top: 8px !important;
}

@media (max-width: 575.98px){
  .page-references .refs-partners{
    padding-top: 40px;
    padding-bottom: 40px;
  }



  .page-references .refs-partners > .container > .col-md-7.mx-auto.text-center.mb-4 > h2.section-title
  {
    font-size: clamp(28px, 8vw, 34px) !important;
    line-height: 1.15 !important;
    letter-spacing: -0.02em ;
    margin-bottom: 16px !important;
  }

  .refs-partners .section-head .section-desc{
    font-size: 16px;
    line-height: 1.5;
    max-width: 34ch;
    margin-left: auto;
    margin-right: auto;
    padding-left: 16px;
    padding-right: 16px;
  }
  .page-references .refs-partners > .container > .col-md-7.mx-auto.text-center.mb-4 > p
  {
    font-size: 16px !important;
  }

  .refs-partners .ref-card .logo-wrap{
    padding: 0 52px;
    height: 140px;
  }

  .refs-partners .col-11{
    margin-left: auto;
    margin-right: auto;
  }

  .page-references .refs-partners .ref-card > h4.ref-title{
    margin-top: 10px !important;
  }
}

/* Volitelné: jemné odbarvení log */
.refs-partners .grayed-out{ filter: grayscale(0.12); }
</style>
