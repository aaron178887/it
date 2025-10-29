import { ref, reactive, computed, watch } from 'vue'
import { ICON_SVGS, ICONS } from '@/Helpers/icons.js'

import {
  CATEGORY_MAP,
  CATEGORY_REVERSE,
  BASE_SERVICE_PATH
} from '@/Helpers/services.constants.js'
import { slugify } from '@/Helpers/slugify.js'

export default function useServiceForm(props){
  const basePath = BASE_SERVICE_PATH

  // robustní UID i mimo secure context / starší prohlížeče
  const uid = () => (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function')
    ? crypto.randomUUID()
    : (Date.now().toString(36) + Math.random().toString(36).slice(2))

  const escapeHtml = (s='') =>
    s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))

  const oneHtmlFromParas = (paras = []) => {
    const out = []
    ;(paras || []).forEach(b => {
      const type = String(b?.type || 'p').toLowerCase()
      const html = (b?.html ?? '').trim()
      const text = (b?.text ?? '').trim()
      const inner = html || (text ? escapeHtml(text) : '')
      if (!inner) return

      if (type === 'h3')        out.push(`<h3>${inner}</h3>`)
      else if (type === 'p')    out.push(`<p>${inner}</p>`)
      else if (type === 'ul' || type === 'ol' || type === 'raw')
                                out.push(inner) // už obsahuje tagy
      else                      out.push(inner) // fallback
    })
    return out.join('')
  }

  function fromServerSection(s, i=0){
    // použij stabilní ID ze serveru; fallback na nové uid()
    const stableId = (s && typeof s.id === 'string' && s.id.trim()) ? s.id : uid()
    const type = (s?.type || 'split').toLowerCase()
    if (type === 'columns'){
      const raw0 = s?.columns?.[0]; const raw1 = s?.columns?.[1]
      const c0 = Array.isArray(raw0) ? raw0 : (raw0?.content ?? raw0?.paragraphs ?? [])
      const c1 = Array.isArray(raw1) ? raw1 : (raw1?.content ?? raw1?.paragraphs ?? [])
      const html1 = oneHtmlFromParas(c0); const html2 = oneHtmlFromParas(c1)
      return {
        id: stableId, layout:'columns', title:s?.title||'',
        text1:html1, text1Html:html1, text2:html2, text2Html:html2,
        imageFile:null, imageUrl:''
      }
    }
    const rawParas = s?.content ?? s?.paragraphs ?? []
    const paras = Array.isArray(rawParas) ? rawParas : (rawParas?.content ?? rawParas?.paragraphs ?? [])
    const html = oneHtmlFromParas(paras)
    const img = s?.image?.src || ''
    const left = s?.imgLeft ?? (String(s?.imagePosition||'').toLowerCase()==='left')
    const layout = img ? (left ? 'split-left' : 'split-right') : 'text'
    return {
      id: stableId, layout, title:s?.title||'',
      text1:html, text1Html:html, text2:'', text2Html:'',
      imageFile:null, imageUrl:img
    }
  }

  const normalizeHtml = (html='') => {
    let h = html.trim()
    h = h
      .replace(/<li>\s*<p>([\s\S]*?)<\/p>\s*<\/li>/gi,'<li>$1</li>')
      .replace(/<p>\s*(<(?:ul|ol)\b[\s\S]*?<\/(?:ul|ol)>)\s*<\/p>/gi,'$1')
      .replace(/<p>(?:\s|&nbsp;|<br\s*\/?>)*<\/p>/gi,'')
      .replace(/<p>([\s\S]*?)<\/p>/gi,(_,inside)=>`<p>${inside.replace(/(?:<br\s*\/?>\s*){2,}/gi,'</p><p>')}</p>`)
    return h
  }

  const mapSection = (s) => {
    const html1 = normalizeHtml(s.text1Html || s.text1)
    const html2 = normalizeHtml(s.text2Html || s.text2)
    const isSplit = s.layout==='split-left' || s.layout==='split-right'

    if (!isSplit) {
      if (s.layout==='columns') {
        return {
          id: s.id,
          type:'columns',
          title:s.title,
          columns:[
            { content: html1 ? [{ html: html1 }] : [] },
            { content: html2 ? [{ html: html2 }] : [] }
          ],
          image: null
        }
      }
      return {
        id: s.id,
        type:'text',
        title:s.title,
        content:[ html1 && { html: html1 } ].filter(Boolean),
        image: null
      }
    }

    const base = {
      id: s.id,
      type:'split',
      title:s.title,
      content:[ html1 && { html: html1 } ].filter(Boolean),
      imagePosition: s.layout==='split-left' ? 'left' : 'right'
    }
    if (s.imageFile) base.image = null
    return base
  }

  const getInitialCategory = () =>
    (props.mode==='edit' && props.initial?.category)
      ? (CATEGORY_REVERSE[props.initial.category] || 'server')
      : 'server'

  const getInitialMenuIcon = () => {
    if (props.mode==='edit' && props.initial?.menu_icon_svg){
      const db = (props.initial.menu_icon_svg || '').trim()
      const norm = (svg) => svg.replace(/\s+/g,' ').replace(/>\s+</g,'><').trim()
      const found = ICONS.find(ic => ICON_SVGS[ic.value] && norm(db)===norm(ICON_SVGS[ic.value]))
      return found ? found.value : '__custom'
    }
    return 'server'
  }

  const initialData = props.initial?.content || {}
  const initialHero = initialData.hero || {}
  const initialSections = (initialData?.data?.sections) ?? []
  const initialFeaturesSection = initialSections.find(s => s.type==='features')
  const initialOtherSections   = initialSections.filter(s => s.type!=='features')

  const form = reactive({
    id:           props.initial?.id || null,
    title:        props.initial?.title || '',
    slug:         props.initial?.slug  || '',
    category:     getInitialCategory(),
    is_published: !!props.initial?.is_published,
    menuIcon:     getInitialMenuIcon(),
    useCustomSvg: getInitialMenuIcon()==='__custom',
    customSvg:    (props.initial?.menu_icon_svg || '').trim(),
    hero: {
      title: initialHero.title || (props.initial?.title || ''),
      lead:  initialHero.lead  || '',
      imageFile:null, imageUrl: initialHero.image || '', remove:false
    }
  })

  const sections = ref(props.mode==='edit' ? initialOtherSections.map(fromServerSection) : [])
  if (props.mode==='create' && sections.value.length===0){
    sections.value.push({
      id: uid(),
      layout:'text', title:'', text1:'', text1Html:'', text2:'', text2Html:'', imageFile:null, imageUrl:''
    })
  }

  const features = ref(
    props.mode==='edit'
      ? (initialFeaturesSection?.items || []).map(it => ({
          id:    uid(),
          title: it.title || '',
          text:  it.text  || '',
          icon:  it.icon  || 'bolt'
        }))
      : []
  )
  const featuresHeading = ref(initialFeaturesSection?.heading || 'Výhody')

  watch(() => form.title, v => {
    if (props.mode==='create'){
      const s = slugify(v || '')
      if (!form.slug || form.slug === slugify(form.slug)) form.slug = s
      if (!form.hero.title) form.hero.title = v || ''
    }
  })

  const step1Valid = computed(() => form.title.trim() && form.slug.trim() && !!form.category)
  const step2Valid = computed(() => form.hero.title.trim() && form.hero.lead.trim() && (props.mode==='edit' || !!form.hero.imageFile))

  function addSection(){
    sections.value.push({
      id: uid(),
      layout:'text', title:'', text1:'', text1Html:'', text2:'', text2Html:'', imageFile:null, imageUrl:''
    })
  }
  function insertBelow(idx){
    sections.value.splice(idx+1,0,{
      ...sections.value[idx],
      id: uid(),
      imageFile:null, imageUrl:''
    })
  }
  function removeSection(idx){ sections.value.splice(idx,1) }
  function moveUp(idx){ if(idx>0) sections.value.splice(idx-1,2,sections.value[idx],sections.value[idx-1]) }
  function moveDown(idx){ if(idx<sections.value.length-1) sections.value.splice(idx,2,sections.value[idx+1],sections.value[idx]) }

  const customUri = computed(() => (form.customSvg || '').trim())

  function buildFormData(){
    const fd = new FormData()
    fd.append('title', form.title)
    fd.append('slug',  form.slug)
    if (form.category) fd.append('category', CATEGORY_MAP[form.category] || form.category)

    // CREATE: neposílat, EDIT: posílat
    if (props.mode === 'edit') {
      fd.append('is_published', form.is_published ? '1' : '0')
    }

    let menuIconToSave = form.menuIcon
    let menuIconSvgToSave = ''
    if (form.useCustomSvg){ menuIconToSave='__custom'; menuIconSvgToSave=form.customSvg.trim() }
    else { menuIconSvgToSave = ICON_SVGS[form.menuIcon] || '' }
    fd.append('menu_icon', menuIconToSave)
    fd.append('menu_icon_svg', menuIconSvgToSave)

    fd.append('hero_title', form.hero.title || '')
    fd.append('hero_lead',  form.hero.lead  || '')
    if (form.hero.remove) fd.append('remove_hero_image', '1')
    else if (form.hero.imageFile) fd.append('hero_image', form.hero.imageFile)

    const sectionsJson = sections.value.map(s => mapSection(s))

    if (features.value.length){
      sectionsJson.push({
        type:'features',
        heading: featuresHeading.value,
        items: features.value.map(it => ({
          title:(it.title||'').trim(),
          text:(it.text||'').trim(),
          icon: it.icon || 'bolt'
        }))
      })
    }

    fd.append('data', JSON.stringify({ hero:{ title:form.hero.title, lead:form.hero.lead }, sections: sectionsJson }))

    sections.value.forEach((s,i)=>{ if (s.imageFile) fd.append(`section_images[${i}]`, s.imageFile) })
    return fd
  }

  function safeScrollTo(opts){
    if (typeof window === 'undefined' || typeof window.scrollTo !== 'function') return
    window.scrollTo(opts)
  }

  return {
    form, sections, features, featuresHeading, basePath,
    step1Valid, step2Valid,
    addSection, insertBelow, removeSection, moveUp, moveDown,
    customUri, buildFormData,
    uid,
    safeScrollTo
  }
}
