<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { Editor, EditorContent } from '@tiptap/vue-3'

import Document     from '@tiptap/extension-document'
import Paragraph    from '@tiptap/extension-paragraph'
import Text         from '@tiptap/extension-text'
import Heading      from '@tiptap/extension-heading'
import BulletList   from '@tiptap/extension-bullet-list'
import OrderedList  from '@tiptap/extension-ordered-list'
import ListItem     from '@tiptap/extension-list-item'
import History      from '@tiptap/extension-history'
import Placeholder  from '@tiptap/extension-placeholder'
import Bold         from '@tiptap/extension-bold'
import Highlight    from '@tiptap/extension-highlight'

const htmlModel = defineModel('html', { type: String, default: '' })

const props = defineProps({
  label: { type: String, default: 'Text' },
  placeholder: { type: String, default: 'Začni psát…' },
})

const editor = ref(null)
const internal = ref(false)

onMounted(() => {
  editor.value = new Editor({
    content: htmlModel.value || '',
    extensions: [
      Document,
      Paragraph,
      Text,
      Heading.configure({ levels: [1, 2, 3] }),
      BulletList,
      OrderedList,
      ListItem,
      History,
      Placeholder.configure({ placeholder: props.placeholder }),
      Bold,
      Highlight.configure({ multicolor: false }),
    ],
    onUpdate({ editor }) {
      internal.value = true
      htmlModel.value = editor.getHTML()
      nextTick(() => { internal.value = false })
    },
  })
})

watch(htmlModel, (v) => {
  if (!editor.value || internal.value) return
  const current = editor.value.getHTML()
  if (v !== current) editor.value.commands.setContent(v || '', false)
})

onBeforeUnmount(() => editor.value?.destroy())

/* Toolbar akce */
function cmd(name) {
  editor.value?.chain().focus()[name]().run()
}

function cmdWithAttrs(name, attrs) {
  editor.value?.chain().focus()[name](attrs).run()
}

function toggleH3() { cmdWithAttrs('toggleHeading', { level: 3 }) }
function toggleUL() { cmd('toggleBulletList') }
function toggleOL() { cmd('toggleOrderedList') }
function toggleBold() { cmd('toggleBold') }
function toggleMark() { cmd('toggleHighlight') }

function isActive(name, attrs) {
  return editor.value?.isActive(name, attrs)
}
</script>

<template>
  <div class="rte">
    <label class="form-label">{{ label }}</label>

    <div class="toolbar">
      <button
        type="button"
        class="btn btn-light border btn-sm"
        :class="{ active: isActive('bold') }"
        :aria-pressed="isActive('bold') ? 'true' : 'false'"
        @click="toggleBold"
        title="Tučně (Ctrl/Cmd + B)"
      >
        <i class="fa-solid fa-bold"></i>
      </button>

      <button
        type="button"
        class="btn btn-light border btn-sm"
        :class="{ active: isActive('highlight') }"
        :aria-pressed="isActive('highlight') ? 'true' : 'false'"
        @click="toggleMark"
        title="Zvýraznit (pozadí)"
      >
        <i class="fa-solid fa-highlighter"></i>
      </button>

      <span class="sep" aria-hidden="true"></span>

      <button
        type="button"
        class="btn btn-light border btn-sm"
        :class="{ active: isActive('heading', { level: 3 }) }"
        :aria-pressed="isActive('heading', { level: 3 }) ? 'true' : 'false'"
        @click="toggleH3"
        title="Nadpis H3"
      >
        <i class="fa-solid fa-heading"></i> H3
      </button>

      <button type="button" class="btn btn-light border btn-sm" @click="toggleUL" title="Seznam UL">
        <i class="fa-solid fa-list-ul"></i>
      </button>

      <button type="button" class="btn btn-light border btn-sm" @click="toggleOL" title="Seznam OL">
        <i class="fa-solid fa-list-ol"></i>
      </button>
    </div>

    <div class="editor-wrap">
      <EditorContent :editor="editor" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.rte .toolbar {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}
.rte .toolbar .sep {
  width: 1px;
  height: 24px;
  background: #e5e7eb;
  margin: 0 2px;
}
.rte .toolbar .btn.active,
.rte .toolbar .btn[aria-pressed="true"] {
  background: color-mix(in srgb, var(--Accent, #10b981) 14%, #fff);
  border-color: color-mix(in srgb, var(--Accent, #10b981) 40%, transparent);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--Accent, #10b981) 16%, transparent);
}

.editor-wrap {
  border: 1px solid #e9eaeb;
  border-radius: 10px;
  background: #fff;
  padding: 10px;
  min-height: 160px;
}

:deep(.ProseMirror) {
  outline: none;
  font: 400 14px/1.6 system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
}
:deep(.ProseMirror p) {
  margin: 0.5rem 0;
}
:deep(.ProseMirror h3) {
  font-weight: 800;
  font-size: 1.05rem;
  margin: 0.6rem 0 0.4rem;
}

/* inline marky */
:deep(.ProseMirror strong) {
  font-weight: 800;
}
:deep(.ProseMirror mark) {
  background: #fff3a3;
  padding: 0.05em 0.15em;
  border-radius: 0.15em;
}

/* UL */
:deep(.ProseMirror ul) {
  margin: 0.4rem 0;
  padding-left: 1.6rem;
  list-style: none;
}
:deep(.ProseMirror ul li) {
  position: relative;
  margin: 0.15rem 0;
}
:deep(.ProseMirror ul li::before) {
  content: '';
  position: absolute;
  left: -1.1rem;
  top: 0.45em;
  width: 0.9rem;
  height: 0.9rem;
  background: currentColor;
  -webkit-mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%23000" d="M9 16.2 4.8 12 3.4 13.4 9 19l12-12-1.4-1.4z"/></svg>') no-repeat 50% 50%;
  mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%23000" d="M9 16.2 4.8 12 3.4 13.4 9 19l12-12-1.4-1.4z"/></svg>') no-repeat 50% 50%;
  -webkit-mask-size: contain;
  mask-size: contain;
}

/* OL */
:deep(.ProseMirror ol) {
  margin: 0.4rem 0;
  padding-left: 1.6rem;
}

/* Placeholder */
:deep(.ProseMirror p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  color: #9aa0a6;
  float: left;
  pointer-events: none;
  height: 0;
}
</style>
