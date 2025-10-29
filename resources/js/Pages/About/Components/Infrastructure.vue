<script setup>
import { computed } from 'vue'

const props = defineProps({
  infrastructure: {
    type: Object,
    default: () => ({ lead: '', blocks: [] }),
  },
})

function asPair (it) {
  return [it?.badge ?? it?.key ?? '', it?.text ?? it?.value ?? '']
}
const normBlocks = computed(() =>
  (props.infrastructure?.blocks || []).map(b => ({
    title: b?.title || '',
    items: (b?.items || []).map(asPair)
  }))
)
</script>

<template>
  <section id="infrastructure" class="infrastructure about-infrastructure" aria-labelledby="infra-heading">
    <div class="container d-flex flex-column gap-2">
      <div class="col-md-7 mx-auto text-center mb-4">
        <h2 id="infra-heading" class="section-title">Naše infrastruktura</h2>
        <p class="section-desc">{{ infrastructure.lead }}</p>
      </div>

      <div class="row g-2 row-cols-1 row-cols-sm-2 p-2 bg-secondary rounded-3">
        <div
          v-for="(block, idx) in normBlocks"
          :key="idx"
          class="col"
        >
          <div class="bg-white h-100 rounded-3 p-4 d-flex flex-column infra-card">
            <div class="infra-icon" aria-hidden="true">
              <!-- ikonky jen podle indexu -->
              <svg
                v-if="idx === 0"
                xmlns="http://www.w3.org/2000/svg"
                width="32" height="32" viewBox="0 0 32 32" fill="none"
                focusable="false"
              >
                <g clip-path="url(#clip0_a)">
                  <path d="M4 9.33337C4 8.27251 4.42143 7.25509 5.17157 6.50495C5.92172 5.7548 6.93913 5.33337 8 5.33337H24C25.0609 5.33337 26.0783 5.7548 26.8284 6.50495C27.5786 7.25509 28 8.27251 28 9.33337V12C28 13.0609 27.5786 14.0783 26.8284 14.8285C26.0783 15.5786 25.0609 16 24 16H8C6.93913 16 5.92172 15.5786 5.17157 14.8285C4.42143 14.0783 4 13.0609 4 12V9.33337Z" stroke="#F52130" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M4 20C4 18.9391 4.42143 17.9217 5.17157 17.1716C5.92172 16.4214 6.93913 16 8 16H24C25.0609 16 26.0783 16.4214 26.8284 17.1716C27.5786 17.9217 28 18.9391 28 20V22.6667C28 23.7275 27.5786 24.7449 26.8284 25.4951C26.0783 26.2452 25.0609 26.6667 24 26.6667H8C6.93913 26.6667 5.92172 26.2452 5.17157 25.4951C4.42143 24.7449 4 23.7275 4 22.6667V20Z" stroke="#F52130" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M9.33325 10.6666V10.68" stroke="#F52130" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M9.33325 21.3334V21.3467" stroke="#F52130" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </g>
                <defs><clipPath id="clip0_a"><rect width="32" height="32" fill="white" /></clipPath></defs>
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                width="32" height="32" viewBox="0 0 32 32" fill="none"
                focusable="false"
              >
                <g clip-path="url(#clip0_b)">
                  <path d="M8.87584 21.3333C5.4465 21.3333 2.6665 18.6573 2.6665 15.356C2.6665 12.056 5.4465 9.37997 8.87584 9.37997C9.39984 7.03063 11.2678 5.1133 13.7758 4.3493C16.2825 3.58663 19.0505 4.09197 21.0345 5.68263C23.0185 7.2693 23.9172 9.69197 23.3945 12.0413H24.7145C27.2652 12.0413 29.3332 14.1213 29.3332 16.6893C29.3332 19.2586 27.2652 21.3386 24.7132 21.3386H8.87584" stroke="#F52130" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M16 21.3334V28" stroke="#F52130" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M21.3335 21.3334V26.6667C21.3335 27.0203 21.474 27.3595 21.724 27.6095C21.9741 27.8596 22.3132 28 22.6668 28H28.0002" stroke="#F52130" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M10.6667 21.3334V26.6667C10.6667 27.0203 10.5262 27.3595 10.2761 27.6095C10.0261 27.8596 9.68695 28 9.33333 28H4" stroke="#F52130" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </g>
                <defs><clipPath id="clip0_b"><rect width="32" height="32" fill="white" /></clipPath></defs>
              </svg>
            </div>

            <!-- NADPIS BLOKU ZAROVNANÝ DOLEVA -->
            <h3 class="fw-bold mb-0 infra-title">{{ block.title }}</h3>

            <ul class="list-unstyled mb-0 mt-3">
              <li v-for="(pair, ii) in block.items" :key="ii" class="infra-item">
                <span class="badge rounded-pill infra-badge">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
                    <g clip-path="url(#c0)">
                      <path d="M10 1.333L10.359 2.928C10.664 4.28 11.72 5.336 13.072 5.641L14.667 6L13.072 6.359C11.72 6.664 10.664 7.72 10.359 9.072L10 10.667L9.641 9.072C9.336 7.72 8.28 6.664 6.928 6.359L5.333 6L6.928 5.641C8.28 5.336 9.336 4.28 9.641 2.928L10 1.333Z" stroke="#717680" stroke-width="1.5" stroke-linejoin="round"/>
                      <path d="M4.667 8L4.923 9.139C5.141 10.105 5.895 10.859 6.861 11.077L8 11.333L6.861 11.59C5.895 11.807 5.141 12.562 4.923 13.528L4.667 14.667L4.41 13.528C4.192 12.562 3.438 11.807 2.472 11.59L1.333 11.333L2.472 11.077C3.438 10.859 4.192 10.105 4.41 9.139L4.667 8Z" stroke="#717680" stroke-width="1.5" stroke-linejoin="round"/>
                    </g>
                    <defs><clipPath id="c0"><rect width="16" height="16" fill="white" /></clipPath></defs>
                  </svg>
                  {{ pair[0] }}
                </span>
                <span class="infra-text">{{ pair[1] }}</span>
              </li>
            </ul>
          </div>
        </div>

        <div v-if="!normBlocks.length" class="col">
          <div class="bg-white h-100 rounded-3 p-4 d-flex align-items-center justify-content-center text-muted">
            Zatím žádné bloky infrastruktury.
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.infrastructure { padding: 56px 16px 56px; }

.about-infrastructure .section-title { font-weight: 800; margin-bottom: 12px; }
.about-infrastructure .section-desc { color: #4b5563; }

.row.bg-secondary { align-items: flex-start; }
.row.bg-secondary .col { display: flex; }
.infra-card { height: 100%; box-shadow: 0 1px 0 rgba(17, 24, 39, 0.06); }

/* zarovnání nadpisů bloků doleva */
.infra-title { text-align: left; }

.infra-icon {
  width: 48px; height: 48px; display: grid; place-items: center;
  background: #fff1f2; border: 1px solid #ffe4e6; border-radius: 12px;
  color: #f52130; margin-bottom: 12px; line-height: 0;
}

.infra-item { display: flex; align-items: center; gap: .5rem; padding: .55rem .25rem; border-bottom: 1px solid #f1f2f4; }
.infra-item:last-child { border-bottom: 0; }

.infra-badge { background: #f8fafc; border: 1px solid #e5e7eb; color: #374151; display: inline-flex; align-items: center; gap: .35rem; padding: .3rem .5rem; font-weight: 700; }
.infra-text { color: #111827; }

@media (max-width: 992px) {
  .infrastructure { padding: 48px 10px 44px; }
}
@media (max-width: 576px) {
  .infrastructure { padding: 40px 12px; }
  .infra-card { padding: 18px !important; }
  .infra-item { flex-direction: column; align-items: flex-start; gap: 8px; padding: 10px 0; }
  .infra-badge { padding: 3px 10px; font-size: 13px; }
}
.infrastructure .infra-icon svg { position: relative; top: -4px; }
</style>
