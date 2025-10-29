<!-- resources/js/Pages/Admin/Components/Services/FeaturesEditor.vue -->
<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { ICONS, ICON_SVGS } from '@/Helpers/icons.js'

/** v-model: Array<{ id:string, title:string, text:string, icon:string }> */
const items = defineModel({ type: Array, default: () => [] })

const uid = () => (crypto?.randomUUID?.() || Math.random().toString(36).slice(2))

// zajisti ID na všech položkách
function ensureIds(){ (items.value || []).forEach(it => { if (!it.id) it.id = uid() }) }
ensureIds()
watch(items, ensureIds, { deep:true })

const rootEl = ref(null)
const cellRefs = ref({})                 // buňka s ikonou
const rowFirstInputRefs = ref({})        // první input v řádku
const popoverSide = ref({})              // { [id]: 'left' | 'right' }
const openPicker = ref(null)             // id položky s otevřeným pickerem
const liveMsg = ref('')                  // aria-live hlášky

function setCellRef (el, id) { if (el) cellRefs.value[id] = el }
function setFirstInputRef (el, id) { if (el) rowFirstInputRefs.value[id] = el }
function svgForKey (k) { return ICON_SVGS[k] || ICON_SVGS.bolt }

function focusRow(id){
  nextTick(() => rowFirstInputRefs.value[id]?.focus())
}

function addRow(){
  const id = uid()
  items.value.push({ id, title:'', text:'', icon:'bolt' })
  liveMsg.value = 'Řádek přidán'
  focusRow(id)
}
function removeRow(i){
  const removed = items.value[i]
  items.value.splice(i,1)
  liveMsg.value = 'Řádek smazán'
  const next = items.value[i]?.id ?? items.value[i-1]?.id
  if (next) focusRow(next)
}
function up(i){
  if (i>0){
    const a = items.value
    const movedId = a[i].id
    a.splice(i-1,2,a[i],a[i-1])
    liveMsg.value = 'Řádek přesunut nahoru'
    focusRow(movedId)
  }
}
function down(i){
  const a = items.value
  if (i<a.length-1){
    const movedId = a[i].id
    a.splice(i,2,a[i+1],a[i])
    liveMsg.value = 'Řádek přesunut dolů'
    focusRow(movedId)
  }
}

function togglePicker(id){
  openPicker.value = openPicker.value===id ? null : id
  nextTick(() => {
    if (openPicker.value !== id) return
    const cell = cellRefs.value[id]
    const box  = rootEl.value?.getBoundingClientRect()
    const rect = cell?.getBoundingClientRect()
    const POPOVER_W = 340
    if (rect && box){
      const spaceRight = box.right - rect.left
      popoverSide.value[id] = (spaceRight < POPOVER_W + 24) ? 'right' : 'left'
    }
  })
}
function selectIcon(id, val){
  const it = items.value.find(x => x.id===id)
  if (it) it.icon = val
  openPicker.value = null
  liveMsg.value = `Ikona nastavena`
}

function onDocClick(e){
  if (!rootEl.value?.contains(e.target)) openPicker.value = null
}
onMounted(() => document.addEventListener('click', onDocClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))
</script>

<template>
  <div ref="rootEl" class="features-box" @click.stop>
    <!-- live region pro čtečky -->
    <div class="visually-hidden" aria-live="polite">{{ liveMsg }}</div>

    <div class="table-responsive no-inner-scroll">
      <table class="table align-middle">
        <thead>
          <tr>
            <th scope="col" class="col-title">
              Název <span class="text-muted">(klikni na ikonku)</span>
            </th>
            <th scope="col">Popis</th>
            <th scope="col" class="col-actions text-end">
              Akce
              <button type="button" class="btn btn-primary btn-xxs ms-2" @click="addRow" title="Přidat řádek">
                <i class="fa-solid fa-plus"></i>
              </button>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(it, i) in items" :key="it.id" :data-fid="it.id">
            <td class="pos-rel" :ref="el => setCellRef(el, it.id)">
              <div class="input-group input-group-sm">
                <button type="button"
                        class="btn btn-light border icon-btn"
                        @click.stop="togglePicker(it.id)"
                        :title="`Vybrat ikonu: ${it.icon}`"
                        aria-haspopup="listbox"
                        :aria-expanded="openPicker===it.id">
                  <span class="svg" v-html="svgForKey(it.icon)"></span>
                </button>
                <input
                  v-model="it.title"
                  class="form-control form-control-sm"
                  placeholder="Špičkový výkon"
                  :ref="el => setFirstInputRef(el, it.id)"
                />
              </div>

              <div v-if="openPicker===it.id"
                   class="icon-popover"
                   :class="{ 'align-right': popoverSide[it.id]==='right' }"
                   role="listbox"
                   aria-label="Výběr ikony"
                   @click.stop>
                <button v-for="opt in ICONS" :key="opt.value" type="button"
                        class="icon-option" :title="opt.label"
                        role="option"
                        @click="selectIcon(it.id,opt.value)">
                  <span class="svg" v-html="ICON_SVGS[opt.value]"></span>
                </button>
              </div>
            </td>

            <td>
              <textarea v-model="it.text" rows="2" class="form-control form-control-sm"
                        placeholder="Zaručený výkon díky moderním CPU a rychlé RAM."></textarea>
            </td>

            <td class="text-end">
              <div class="btn-group btn-group-sm">
                <button class="btn btn-light border" :disabled="i===0" @click="up(i)" title="Nahoru" aria-label="Přesunout řádek nahoru">
                  <i class="fa-solid fa-arrow-up"></i>
                </button>
                <button class="btn btn-light border" :disabled="i===items.length-1" @click="down(i)" title="Dolů" aria-label="Přesunout řádek dolů">
                  <i class="fa-solid fa-arrow-down"></i>
                </button>
                <button class="btn btn-outline-danger" @click="removeRow(i)" title="Smazat" aria-label="Smazat řádek">
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="!items.length">
            <td colspan="3" class="text-center text-muted py-4">
              Zatím žádné položky. Přidej první řádek.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="sticky-add">
      <button type="button" class="btn btn-primary btn-sm" @click="addRow">
        <i class="fa-solid fa-plus me-1"></i> Přidat řádek
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.features-box{
  border:1px solid #e9eaeb; border-radius:12px; padding:12px; background:#fff;
  overflow: visible;
}

.visually-hidden{
  position:absolute !important; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0;
}

.no-inner-scroll{ overflow: visible !important; }
.no-inner-scroll::-webkit-scrollbar{ display:none; }
.table{ margin-bottom:0; }
.table thead th{
  background:#f8f9fa; border-bottom:1px solid #e1e5ea; font-weight:800;
}


.col-title{ width:360px; }
.col-actions{ width:160px; }

.icon-btn{
  width:38px;
  display:flex;
  align-items:center;
  justify-content:center;
  padding: 0;
}
.pos-rel{ position:relative; }
.svg :deep(svg){
  width: 20px;
  height: 20px;
  display: block;
  stroke: currentColor;
  fill: none;
}

.icon-popover{
  position:absolute; z-index:10; top:100%; left:0; margin-top:6px;
  background:#fff; border:1px solid #e1e5ea; border-radius:10px; padding:12px;
  box-shadow:0 8px 22px rgba(0,0,0,.08); width:340px;
  display:grid; grid-template-columns:repeat(8, 1fr); gap:8px;
}
.icon-popover.align-right{ left:auto; right:0; }
.icon-option{
  width:36px; height:36px; display:grid; place-items:center;
  border:1px solid #e9eaeb; border-radius:8px; background:#fff; color:#111827;
  padding: 0;
  transition: all 0.15s ease;
}
.icon-option:hover{
  background:#f6f7f9;
  border-color: #cbd5e0;
  transform: translateY(-1px);
}
.icon-option .svg :deep(svg){
  width: 20px;
  height: 20px;
  display: block;
  stroke: currentColor;
  fill: none;
}

.sticky-add{
  position: sticky; bottom:-1px;
  display:flex; justify-content:flex-end;
  padding:8px 0 0;
  background: linear-gradient(180deg, rgba(255,255,255,0) 0%, #fff 40%);
  border-top:1px solid #edf0f3; margin-top:8px;
}

.btn-xxs{
  --bs-btn-padding-y: .125rem;
  --bs-btn-padding-x: .35rem;
  --bs-btn-font-size: .75rem;
  line-height: 1;
}
</style>
