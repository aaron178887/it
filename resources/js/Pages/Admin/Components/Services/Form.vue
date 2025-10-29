<script setup>
import { ref, nextTick } from 'vue'
import { useForm } from '@inertiajs/vue3'

import Stepper         from '@/Pages/Admin/Components/Services/Form/Stepper.vue'
import StepBasic       from '@/Pages/Admin/Components/Services/Form/StepBasic.vue'
import StepHero        from '@/Pages/Admin/Components/Services/Form/StepHero.vue'
import StepSections    from '@/Pages/Admin/Components/Services/Form/StepSections.vue'
import StepFeatures    from '@/Pages/Admin/Components/Services/Form/StepFeatures.vue'
import useServiceForm  from '@/Pages/Admin/Components/Services/Form/useServiceForm.js'

const props = defineProps({
  mode:    { type: String, default: 'create' },  // create | edit
  initial: { type: Object, default: () => ({}) }
})

const step = ref(1)

const {
  form, sections, features, featuresHeading, basePath,
  step1Valid, step2Valid,
  addSection, insertBelow, removeSection, moveUp, moveDown,
  customUri, buildFormData
} = useServiceForm(props)

// jeden useForm request pro submit (payload dodáme přes transform → FormData)
const request = useForm({})

function goSave () {
  const url = props.mode === 'create'
    ? '/admin/services'
    : `/admin/services/${form.id}`

  request.clearErrors()

  request
    .transform(() => {
      const fd = buildFormData()   // tip: pokud můžeš, přidej i keys section_images_by_id[<id>]
      if (props.mode === 'edit') {
        fd.append('_method', 'PUT') // method spoofing pro Route::put(...)
      }
      return fd
    })
    .post(url, {
      forceFormData: true,     // multipart
      preserveScroll: true,
      onError: (errs) => {
        if (errs?.slug) {
          step.value = 1
          nextTick(() => document.querySelector('#service-slug')?.focus())
        }
      },
    })
}
</script>

<template>
  <div class="card-wrap">
    <Stepper :step="step" />

    <StepBasic
      v-if="step===1"
      v-model:title="form.title"
      v-model:slug="form.slug"
      v-model:category="form.category"
      v-model:menuIcon="form.menuIcon"
      v-model:useCustomSvg="form.useCustomSvg"
      v-model:customSvg="form.customSvg"
      :base-path="basePath"
      :custom-uri="customUri"
      :valid="step1Valid"
      :errors="request.errors"
      @next="step=2"
    />

    <StepHero
      v-else-if="step===2"
      v-model:title="form.hero.title"
      v-model:lead="form.hero.lead"
      v-model:image-file="form.hero.imageFile"
      v-model:image-url="form.hero.imageUrl"
      v-model:remove="form.hero.remove"
      :mode="props.mode"
      :valid="step2Valid"
      @prev="step=1"
      @next="step=3"
    />

    <StepSections
      v-else-if="step===3"
      v-model="sections"
      :mode="props.mode"
      @add="addSection"
      @insert-below="insertBelow"
      @remove="removeSection"
      @up="moveUp"
      @down="moveDown"
      @prev="step=2"
      @next="step=4"
    />

    <StepFeatures
      v-else
      v-model:items="features"
      v-model:heading="featuresHeading"
      @prev="step=3"
      @save="goSave"
      :saving-label="request.processing ? 'Ukládám…' : (props.mode==='edit' ? 'Uložit změny' : 'Uložit')"
    />

    <div v-if="Object.keys(request.errors).length" class="alert alert-danger mt-3">
      <div v-for="(msg, key) in request.errors" :key="key">{{ msg }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card-wrap{ background:#fff; border:1px solid #e9eaeb; border-radius:12px; padding:16px; }
/* doporučení: auto výška u „auto“ médií, jinak mohou zmizet */
.media.media--auto img{ height:auto; }
</style>
