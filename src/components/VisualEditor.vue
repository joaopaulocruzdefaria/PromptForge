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
  import { watch, ref } from "vue";

  const props = defineProps<{
    modelValue: string;
    placeholder?: string;
  }>();

  const emit = defineEmits<{
    "update:modelValue": [value: string];
  }>();

  const scrollContainerRef = ref<HTMLElement | null>(null);

  defineExpose({
    scrollContainer: scrollContainerRef,
  });

  const editor = useEditor({
    content: props.modelValue,
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
        class:
          "max-w-none focus:outline-none min-h-[600px] text-gray-300 caret-fuchsia-500 selection:bg-fuchsia-500/30 selection:text-fuchsia-200",
      },
    },
    onUpdate: ({ editor }) => {
      const markdown = (editor.storage as any).markdown.getMarkdown();
      emit("update:modelValue", markdown);
    },
  });

  watch(
    () => props.modelValue,
    (newValue) => {
      if (editor.value && newValue !== (editor.value.storage as any).markdown.getMarkdown()) {
        editor.value.commands.setContent(newValue);
      }
    }
  );
</script>

<template>
  <div
    class="bg-zinc-900 rounded-xl shadow-2xl shadow-black/50 border border-zinc-800 overflow-hidden h-[75vh] w-full flex flex-col relative group transition-colors duration-300 hover:border-zinc-700"
  >
    <div
      v-if="editor"
      class="bg-zinc-900 border-b border-zinc-800 p-2 flex flex-wrap items-center gap-1 shrink-0 h-12"
    >
      <button
        @click="editor.chain().focus().toggleBold().run()"
        :class="
          editor.isActive('bold')
            ? 'bg-fuchsia-500/20 text-fuchsia-400'
            : 'text-gray-400 hover:bg-zinc-700 hover:text-gray-200'
        "
        class="p-2 rounded transition-colors"
        title="Negrito"
      >
        <Bold :size="18" />
      </button>
      <button
        @click="editor.chain().focus().toggleItalic().run()"
        :class="
          editor.isActive('italic')
            ? 'bg-fuchsia-500/20 text-fuchsia-400'
            : 'text-gray-400 hover:bg-zinc-700 hover:text-gray-200'
        "
        class="p-2 rounded transition-colors"
        title="Itálico"
      >
        <Italic :size="18" />
      </button>

      <div class="w-px h-6 bg-zinc-700 mx-1"></div>

      <button
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        :class="
          editor.isActive('heading', { level: 1 })
            ? 'bg-fuchsia-500/20 text-fuchsia-400'
            : 'text-gray-400 hover:bg-zinc-700 hover:text-gray-200'
        "
        class="p-2 rounded transition-colors"
        title="H1"
      >
        <Heading1 :size="18" />
      </button>
      <button
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="
          editor.isActive('heading', { level: 2 })
            ? 'bg-fuchsia-500/20 text-fuchsia-400'
            : 'text-gray-400 hover:bg-zinc-700 hover:text-gray-200'
        "
        class="p-2 rounded transition-colors"
        title="H2"
      >
        <Heading2 :size="18" />
      </button>
      <button
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        :class="
          editor.isActive('heading', { level: 3 })
            ? 'bg-fuchsia-500/20 text-fuchsia-400'
            : 'text-gray-400 hover:bg-zinc-700 hover:text-gray-200'
        "
        class="p-2 rounded transition-colors"
        title="H3"
      >
        <Heading3 :size="18" />
      </button>
      <button
        @click="editor.chain().focus().setParagraph().run()"
        :class="
          editor.isActive('paragraph')
            ? 'bg-fuchsia-500/20 text-fuchsia-400'
            : 'text-gray-400 hover:bg-zinc-700 hover:text-gray-200'
        "
        class="p-2 rounded transition-colors"
        title="Parágrafo"
      >
        <Pilcrow :size="18" />
      </button>

      <div class="w-px h-6 bg-zinc-700 mx-1"></div>

      <button
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="
          editor.isActive('bulletList')
            ? 'bg-fuchsia-500/20 text-fuchsia-400'
            : 'text-gray-400 hover:bg-zinc-700 hover:text-gray-200'
        "
        class="p-2 rounded transition-colors"
        title="Lista"
      >
        <List :size="18" />
      </button>
      <button
        @click="editor.chain().focus().setHorizontalRule().run()"
        class="p-2 rounded text-gray-400 hover:bg-zinc-700 hover:text-gray-200 transition-colors"
        title="Linha"
      >
        <Minus :size="18" />
      </button>
    </div>

    <div
      ref="scrollContainerRef"
      class="flex-1 overflow-y-auto p-6 sm:p-8 cursor-text custom-scrollbar"
      @click="editor?.chain().focus().run()"
    >
      <editor-content :editor="editor" />
    </div>
  </div>
</template>

<style>
  /* ESTILOS GLOBAIS DO PROSEMIRROR (EDITOR)
   Adaptados para Dark Mode
*/
  .ProseMirror {
    font-family: ui-sans-serif, system-ui, sans-serif;
  }

  /* Títulos: Cores claras (Zinc-100 a Zinc-300) */
  .ProseMirror h1 {
    font-size: 24pt;
    line-height: 1.2;
    font-weight: 800;
    margin-top: 1.5em;
    margin-bottom: 0.5em;
    color: #f4f4f5;
  }
  .ProseMirror h2 {
    font-size: 18pt;
    line-height: 1.3;
    font-weight: 700;
    margin-top: 1.2em;
    margin-bottom: 0.5em;
    color: #e4e4e7;
  }
  .ProseMirror h3 {
    font-size: 15pt;
    line-height: 1.4;
    font-weight: 600;
    margin-top: 1em;
    margin-bottom: 0.5em;
    color: #d4d4d8;
  }

  /* Texto comum: Cinza médio (Zinc-300) */
  .ProseMirror p,
  .ProseMirror ul,
  .ProseMirror ol {
    font-size: 12pt;
    line-height: 1.6;
    margin-bottom: 1em;
    color: #d4d4d8;
  }

  .ProseMirror ul {
    list-style-type: disc;
    padding-left: 1.5em;
  }

  /* Linha horizontal: Cinza escuro */
  .ProseMirror hr {
    border-top: 2px solid #3f3f46;
    margin: 2rem 0;
  }

  /* Scrollbar Dark (Mesma do componente anterior) */
  .custom-scrollbar::-webkit-scrollbar {
    width: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #3f3f46; /* zinc-700 */
    border-radius: 5px;
    border: 2px solid #18181b; /* zinc-900 */
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #52525b; /* zinc-600 */
  }
</style>
