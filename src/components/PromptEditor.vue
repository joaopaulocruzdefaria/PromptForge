<script setup lang="ts">
  import { useEditor, EditorContent } from "@tiptap/vue-3";
  import StarterKit from "@tiptap/starter-kit";
  import Typography from "@tiptap/extension-typography";
  import { Markdown } from "tiptap-markdown";
  import {
    Bold,
    Italic,
    Heading1,
    Heading2,
    Heading3,
    Pilcrow,
    List,
    Minus,
  } from "lucide-vue-next";

  const editor = useEditor({
    content: "# Contexto Inicial\nDigite seu prompt aqui...",
    extensions: [
      StarterKit,
      Typography,
      Markdown.configure({
        html: false,
        transformPastedText: true,
        transformCopiedText: true,
      }),
    ],
    editorProps: {
      attributes: {
        class: "max-w-none focus:outline-none min-h-[600px] text-gray-800",
      },
    },
  });
</script>

<template>
  <div class="min-h-screen bg-[#F9FBFD] py-10 px-4 flex justify-center">
    <div
      class="w-full max-w-212.5 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative"
    >
      <div
        v-if="editor"
        class="sticky top-0 z-10 bg-white border-b border-gray-200 p-3 flex items-center gap-2"
      >
        <button
          @click="editor.chain().focus().toggleBold().run()"
          :class="{
            'bg-blue-100 text-blue-600': editor.isActive('bold'),
          }"
          class="p-2 rounded hover:bg-gray-100 transition-colors"
          title="Negrito"
        >
          <Bold :size="18" />
        </button>

        <button
          @click="editor.chain().focus().toggleItalic().run()"
          :class="{
            'bg-blue-100 text-blue-600': editor.isActive('italic'),
          }"
          class="p-2 rounded hover:bg-gray-100 transition-colors"
          title="Itálico"
        >
          <Italic :size="18" />
        </button>

        <div class="w-px h-6 bg-gray-300 mx-2"></div>

        <button
          @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
          :class="{
            'bg-blue-100 text-blue-600': editor.isActive('heading', { level: 1 }),
          }"
          class="p-2 rounded hover:bg-gray-100 transition-colors"
          title="Título Principal (Aumentar Letra)"
        >
          <Heading1 :size="18" />
        </button>

        <button
          @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
          :class="{
            'bg-blue-100 text-blue-600': editor.isActive('heading', { level: 2 }),
          }"
          class="p-2 rounded hover:bg-gray-100 transition-colors"
          title="Subtítulo"
        >
          <Heading2 :size="18" />
        </button>

        <button
          @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
          :class="{
            'bg-blue-100 text-blue-600': editor.isActive('heading', { level: 3 }),
          }"
          class="p-2 rounded hover:bg-gray-100 transition-colors"
          title="H3 (15pt)"
        >
          <Heading3 :size="18" />
        </button>

        <button
          @click="editor.chain().focus().setParagraph().run()"
          :class="{
            'bg-blue-100 text-blue-600': editor.isActive('paragraph'),
          }"
          class="p-2 rounded hover:bg-gray-100 transition-colors"
          title="Texto Normal (12pt)"
        >
          <Pilcrow :size="18" />
        </button>

        <div class="w-px h-6 bg-gray-300 mx-2"></div>

        <button
          @click="editor.chain().focus().toggleBulletList().run()"
          :class="{
            'bg-blue-100 text-blue-600': editor.isActive('bulletList'),
          }"
          class="p-2 rounded hover:bg-gray-100 transition-colors"
          title="Lista"
        >
          <List :size="18" />
        </button>

        <button
          @click="editor.chain().focus().setHorizontalRule().run()"
          class="p-2 rounded hover:bg-gray-100 transition-colors"
          title="Inserir Linha Separadora"
        >
          <Minus :size="18" />
        </button>
      </div>

      <div class="p-10 sm:p-16">
        <editor-content :editor="editor" />
      </div>
    </div>
  </div>
</template>

<style>
  /* Reset de fonte para garantir consistência */
  .ProseMirror {
    font-family: ui-sans-serif, system-ui, sans-serif;
  }

  /* H1 - 24pt */
  .ProseMirror h1 {
    font-size: 24pt;
    line-height: 1.2;
    font-weight: 800;
    margin-top: 1.5em;
    margin-bottom: 0.5em;
    color: #111827;
  }

  /* H2 - 18pt */
  .ProseMirror h2 {
    font-size: 18pt;
    line-height: 1.3;
    font-weight: 700;
    margin-top: 1.2em;
    margin-bottom: 0.5em;
    color: #374151;
  }

  /* H3 - 15pt */
  .ProseMirror h3 {
    font-size: 15pt;
    line-height: 1.4;
    font-weight: 600;
    margin-top: 1em;
    margin-bottom: 0.5em;
    color: #4b5563;
  }

  /* Texto Normal - 12pt */
  .ProseMirror p,
  .ProseMirror ul,
  .ProseMirror ol {
    font-size: 12pt;
    line-height: 1.6;
    margin-bottom: 1em;
    color: #374151;
  }

  /* Manter formatação de listas e linhas */
  .ProseMirror ul {
    list-style-type: disc;
    padding-left: 1.5em;
  }
  .ProseMirror hr {
    border-top: 2px solid #e5e7eb;
    margin: 2rem 0;
  }
</style>
