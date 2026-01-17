<script setup lang="ts">
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Typography from "@tiptap/extension-typography";
import { Markdown } from "tiptap-markdown";
import { Bold, Italic, Heading1, Heading2, Heading3, Pilcrow, List, Minus } from "lucide-vue-next";
import { watch, ref } from "vue";

const props = defineProps<{
  modelValue: string;
  placeholder?: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

// Referência para o elemento que tem o scroll
const scrollContainerRef = ref<HTMLElement | null>(null);

// Expõe essa referência para o componente pai
defineExpose({
    scrollContainer: scrollContainerRef
});

const editor = useEditor({
  content: props.modelValue,
  extensions: [
      StarterKit,
      Typography,
      Markdown.configure({ html: false, transformPastedText: true, transformCopiedText: true }),
    ],
    editorProps: {
      attributes: { class: "max-w-none focus:outline-none min-h-[600px] text-gray-800" },
    },
    onUpdate: ({ editor }) => {
      const markdown = editor.storage.markdown.getMarkdown();
      emit("update:modelValue", markdown);
  },
});

// Sincroniza mudanças externas
watch(() => props.modelValue, (newValue) => {
  if (editor.value && newValue !== editor.value.storage.markdown.getMarkdown()) {
    editor.value.commands.setContent(newValue);
  }
});
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-[75vh] w-full flex flex-col relative group">
    
    <div v-if="editor" class="bg-white border-b border-gray-200 p-2 flex flex-wrap items-center gap-1 shrink-0 z-10">
       <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'bg-blue-100 text-blue-600': editor.isActive('bold') }" class="p-2 rounded hover:bg-gray-100 transition-colors" title="Negrito"><Bold :size="18" /></button>
      <button @click="editor.chain().focus().toggleItalic().run()" :class="{ 'bg-blue-100 text-blue-600': editor.isActive('italic') }" class="p-2 rounded hover:bg-gray-100 transition-colors" title="Itálico"><Italic :size="18" /></button>
      <div class="w-px h-6 bg-gray-300 mx-1"></div>
      <button @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'bg-blue-100 text-blue-600': editor.isActive('heading', { level: 1 }) }" class="p-2 rounded hover:bg-gray-100 transition-colors" title="H1"><Heading1 :size="18" /></button>
      <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'bg-blue-100 text-blue-600': editor.isActive('heading', { level: 2 }) }" class="p-2 rounded hover:bg-gray-100 transition-colors" title="H2"><Heading2 :size="18" /></button>
       <button @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'bg-blue-100 text-blue-600': editor.isActive('heading', { level: 3 }) }" class="p-2 rounded hover:bg-gray-100 transition-colors" title="H3"><Heading3 :size="18" /></button>
      <button @click="editor.chain().focus().setParagraph().run()" :class="{ 'bg-blue-100 text-blue-600': editor.isActive('paragraph') }" class="p-2 rounded hover:bg-gray-100 transition-colors" title="Parágrafo"><Pilcrow :size="18" /></button>
      <div class="w-px h-6 bg-gray-300 mx-1"></div>
      <button @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'bg-blue-100 text-blue-600': editor.isActive('bulletList') }" class="p-2 rounded hover:bg-gray-100 transition-colors" title="Lista"><List :size="18" /></button>
      <button @click="editor.chain().focus().setHorizontalRule().run()" class="p-2 rounded hover:bg-gray-100 transition-colors" title="Linha"><Minus :size="18" /></button>
    </div>

    <div ref="scrollContainerRef" class="flex-1 overflow-y-auto p-6 sm:p-8 cursor-text" @click="editor?.chain().focus().run()">
      <editor-content :editor="editor" />
    </div>
  </div>
</template>

<style>
.ProseMirror { font-family: ui-sans-serif, system-ui, sans-serif; }
.ProseMirror h1 { font-size: 24pt; line-height: 1.2; font-weight: 800; margin-top: 1.5em; margin-bottom: 0.5em; color: #111827; }
.ProseMirror h2 { font-size: 18pt; line-height: 1.3; font-weight: 700; margin-top: 1.2em; margin-bottom: 0.5em; color: #374151; }
.ProseMirror h3 { font-size: 15pt; line-height: 1.4; font-weight: 600; margin-top: 1em; margin-bottom: 0.5em; color: #4B5563; }
.ProseMirror p, .ProseMirror ul, .ProseMirror ol { font-size: 12pt; line-height: 1.6; margin-bottom: 1em; color: #374151; }
.ProseMirror ul { list-style-type: disc; padding-left: 1.5em; }
.ProseMirror hr { border-top: 2px solid #e5e7eb; margin: 2rem 0; }
</style>