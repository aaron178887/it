<!-- resources/js/Pages/Contact/Components/Content.vue -->
<script setup>
import ContactForm from '@/Pages/Contact/Components/Form.vue'

const props = defineProps({
  company:  { type: Object, required: true },
  contacts: { type: Object, required: true }
})
</script>

<template>
  <section aria-labelledby="contact-heading" class="contact-section">
    <div class="py-5">
      <div class="container d-flex flex-column gap-2">
        <h2 id="contact-heading" class="sr-only">Kontaktní údaje a formulář</h2>

        <div class="d-flex flex-column flex-lg-row gap-3 justify-content-between">
          <!-- Levý sloupec -->
          <div class="col contact-info">
            <!-- Identifikační údaje -->
            <section class="bg-secondary p-3 d-flex flex-column gap-3 mb-2 rounded-3" aria-labelledby="company-id-heading">
              <h3 id="company-id-heading" class="fw-bold mb-2">Identifikační údaje</h3>

              <p class="fw-bold mb-0">{{ company.name || 'IT Globe s.r.o. (OpenVPS)' }}</p>

              <div class="d-flex flex-wrap align-items-center gap-3">
                <span class="bg-white px-3 py-2 rounded-3 d-inline-flex align-items-center" aria-hidden="true">
                 
                  <svg class="icon-16 text-primary" viewBox="0 0 16 16" width="16" height="16" fill="none" focusable="false" aria-hidden="true">
                    <path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
                <p class="mb-0">IČ: {{ company.ic || '—' }}</p>
              </div>

              <div class="d-flex flex-wrap align-items-center gap-3">
                <span class="bg-white px-3 py-2 rounded-3 d-inline-flex align-items-center" aria-hidden="true">
                  <svg class="icon-16 text-primary" viewBox="0 0 16 16" width="16" height="16" fill="none" focusable="false" aria-hidden="true">
                    <path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
                <p class="mb-0">DIČ: {{ company.dic || '—' }}</p>
              </div>

              <div class="d-flex flex-wrap align-items-center gap-3">
                <span class="bg-white px-3 py-2 rounded-3 d-inline-flex align-items-center" aria-hidden="true">
                  <svg class="icon-16 text-primary" viewBox="0 0 16 16" width="16" height="16" fill="none" focusable="false" aria-hidden="true">
                    <path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
                <p class="mb-0">{{ company.registry || '—' }}</p>
              </div>
            </section>

            <!-- Kontakty -->
            <section class="bg-secondary p-3 d-flex flex-column gap-3 rounded-3" aria-labelledby="contacts-heading">
              <h3 id="contacts-heading" class="fw-bold mb-2">Kontakty</h3>
              <p class="fw-bold mb-0">{{ contacts.note || 'K dispozici 24/7' }}</p>

              <!-- Adresa -->
              <div class="bg-white p-2 rounded-3 d-flex flex-wrap align-items-center gap-3">
                <span class="d-inline-flex" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 16 16" fill="none" focusable="false" aria-hidden="true">
                    <g clip-path="url(#clip0_loc)">
                      <path d="M14.6663 6.66665V6.14497C14.6663 4.85189 14.6663 4.20536 14.2758 3.80365C13.8853 3.40194 13.2567 3.40194 11.9997 3.40194H10.6139C10.0023 3.40194 9.99727 3.40075 9.44734 3.12554L7.22627 2.01407C6.2989 1.55001 5.83522 1.31797 5.34126 1.3341C4.84729 1.35023 4.39885 1.61203 3.50197 2.13565L2.68339 2.61356C2.0246 2.99817 1.6952 3.19049 1.5141 3.51041C1.33301 3.83033 1.33301 4.21993 1.33301 4.99913V10.4771C1.33301 11.5009 1.33301 12.0128 1.56118 12.2978C1.71301 12.4873 1.92578 12.6148 2.16101 12.657C2.51451 12.7205 2.94733 12.4678 3.81292 11.9624C4.40071 11.6193 4.96641 11.2629 5.66959 11.3596C6.2588 11.4405 6.80634 11.8123 7.33301 12.0758" stroke="#F52130" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M5.33301 1.33331V11.3333" stroke="#F52130" stroke-width="1.5" stroke-linejoin="round"/>
                      <path d="M10 3.33331V6.33331" stroke="#F52130" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M12.2059 14.4557C12.0613 14.591 11.8681 14.6667 11.6671 14.6667C11.466 14.6667 11.2728 14.591 11.1283 14.4557C9.80452 13.2087 8.03066 11.8157 8.89572 9.7932C9.36346 8.69973 10.4863 8 11.6671 8C12.8479 8 13.9707 8.69973 14.4384 9.7932C15.3024 11.8131 13.5329 13.2129 12.2059 14.4557Z" stroke="#F52130" stroke-width="1.5"/>
                      <path d="M11.667 11H11.673" stroke="#F52130" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </g>
                    <defs><clipPath id="clip0_loc"><rect width="16" height="16" fill="white"/></clipPath></defs>
                  </svg>
                </span>
                <p class="mb-0">{{ contacts.address || 'Orlické Podhůří 30, 562 01 Ústí nad Orlicí' }}</p>
              </div>

              <!-- E-mail -->
              <div class="bg-white p-2 rounded-3 d-flex flex-wrap align-items-center gap-3">
                <span class="d-inline-flex" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 16 16" fill="none" focusable="false" aria-hidden="true">
                    <g clip-path="url(#clip0_mail)">
                      <path d="M4.33301 6H5.66634" stroke="#F52130" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M11.667 5.33331V2.66665C11.667 1.93027 12.2639 1.33331 13.0003 1.33331" stroke="#F52130" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M8.33301 12V14.6667" stroke="#F52130" stroke-width="1.5" stroke-linecap="round"/>
                      <path d="M11.667 3.43924C11.0237 3.33331 10.1731 3.33331 8.91699 3.33331H7.08366C5.13813 3.33331 4.16537 3.33331 3.42901 3.72691C2.84758 4.03769 2.37137 4.5139 2.06059 5.09533C1.66699 5.83169 1.66699 6.80445 1.66699 8.74998C1.66699 9.91731 1.66699 10.501 1.90315 10.9428C2.08962 11.2916 2.37535 11.5774 2.7242 11.7638C3.16602 12 3.74968 12 4.91699 12H11.0837C12.251 12 12.8347 12 13.2765 11.7638C13.6253 11.5774 13.9111 11.2916 14.0975 10.9428C14.3337 10.501 14.3337 9.91731 14.3337 8.74998C14.3337 6.80445 14.3337 5.83169 13.9401 5.09533C13.8241 4.87835 13.6851 4.67602 13.5261 4.49148" stroke="#F52130" stroke-width="1.5" stroke-linecap="round"/>
                      <path d="M8.33341 12V7.33334C8.33341 6.714 8.33341 6.40433 8.29234 6.14522C8.06647 4.71891 6.94781 3.60028 5.52151 3.37437C5.46694 3.36573 5.41011 3.3589 5.34863 3.35352" stroke="#F52130" stroke-width="1.5" stroke-linecap="round"/>
                    </g>
                    <defs><clipPath id="clip0_mail"><rect width="16" height="16" fill="white"/></clipPath></defs>
                  </svg>
                </span>
                <p class="mb-0">
                  <a
                    class="text-primary text-decoration-underline"
                    :href="contacts.email ? `mailto:${contacts.email}` : 'mailto:info@openvps.cz'">
                    {{ contacts.email || 'info@openvps.cz' }}
                  </a>
                </p>
              </div>

              <!-- Telefon -->
              <div class="bg-white p-2 rounded-3 d-flex flex-wrap align-items-center gap-3">
                <span class="d-inline-flex" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 16 16" fill="none" focusable="false" aria-hidden="true">
                    <path d="M6.1055 3.80815L5.83707 3.20417C5.66155 2.80925 5.57379 2.61179 5.44254 2.46067C5.27805 2.27129 5.06364 2.13196 4.82378 2.05857C4.63239 2 4.4163 2 3.98414 2C3.35194 2 3.03584 2 2.77048 2.12153C2.45791 2.26468 2.17562 2.57552 2.06315 2.9004C1.96767 3.17619 1.99502 3.45962 2.04972 4.02647C2.63194 10.0601 5.93988 13.3681 11.9735 13.9503C12.5404 14.005 12.8238 14.0323 13.0996 13.9369C13.4245 13.8244 13.7353 13.5421 13.8785 13.2295C14 12.9641 14 12.6481 14 12.0159C14 11.5837 14 11.3676 13.9414 11.1762C13.868 10.9363 13.7287 10.7219 13.5393 10.5575C13.3882 10.4262 13.1908 10.3385 12.7958 10.1629L12.1918 9.89447C11.7642 9.7044 11.5503 9.6094 11.333 9.58873C11.125 9.56893 10.9154 9.59813 10.7207 9.67393C10.5173 9.75313 10.3376 9.90293 9.97797 10.2025C9.6201 10.5008 9.44117 10.6499 9.2225 10.7298C9.02864 10.8006 8.77237 10.8269 8.56824 10.7967C8.3379 10.7628 8.16157 10.6686 7.80884 10.4801C6.7115 9.89367 6.10635 9.28853 5.51991 8.19113C5.33143 7.83847 5.23718 7.66207 5.20324 7.4318C5.17316 7.2276 5.19938 6.97133 5.2702 6.77753C5.35008 6.55885 5.49921 6.37991 5.79746 6.022C6.09708 5.66245 6.24689 5.48268 6.3261 5.27927C6.4019 5.08463 6.43108 4.87493 6.4113 4.66699C6.39063 4.44968 6.29558 4.23584 6.1055 3.80815Z" stroke="#F52130" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                </span>
                <p class="mb-0">
                  <a
                    class="text-primary text-decoration-underline"
                    :href="`tel:${(contacts.phone || '+420 733 482 481').replace(/\\s+/g,'')}`">
                    {{ contacts.phone || '+420 733 482 481' }}
                  </a>
                </p>
              </div>
            </section>
          </div>

          <!-- Pravý sloupec -->
          <div class="col">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.icon-16{ width:16px; height:16px; display:inline-block; }

section.contact-section .contact-info section.bg-secondary{
  background-color: #E9EAEB !important;
}
.text-primary{
  color: #F52130 !important;
}
</style>
