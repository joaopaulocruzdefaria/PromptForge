<script setup lang="ts">
  import { ref, watchEffect, nextTick, onBeforeUnmount } from "vue";
  import VisualEditor from "./VisualEditor.vue";
  import MarkdownEditor from "./MarkdownEditor.vue";
  import { FileText, Code, SplitSquareHorizontal, Link2, Link2Off } from "lucide-vue-next";

  const props = defineProps<{
    initialContent?: string;
    mode?: "visual" | "markdown" | "split";
  }>();

  const emit = defineEmits<{
    "update:content": [value: string];
  }>();

  const content = ref(props.initialContent || "# Contexto Inicial\nDigite seu prompt aqui...");
  const currentMode = ref(props.mode || "visual");
  const isSyncScrollEnabled = ref(false);

  // Referências para as instâncias dos componentes filhos
  const visualEditorRef = ref<InstanceType<typeof VisualEditor> | null>(null);
  const markdownEditorRef = ref<InstanceType<typeof MarkdownEditor> | null>(null);

  const updateContent = (newContent: string) => {
    content.value = newContent;
    emit("update:content", newContent);
  };

  // --- Lógica de Scroll Sincronizado ---
  let isProgrammaticScroll = false; // Trava para evitar loop infinito de eventos scroll
  let unregisterListeners: (() => void) | null = null;

  const syncScroll = (source: "visual" | "markdown") => {
    if (!isSyncScrollEnabled.value || isProgrammaticScroll || currentMode.value !== "split") return;

    const vContainer = visualEditorRef.value?.scrollContainer;
    const mContainer = markdownEditorRef.value?.scrollContainer;

    if (!vContainer || !mContainer) return;

    isProgrammaticScroll = true;

    // Usamos requestAnimationFrame para garantir que a UI esteja pronta e suavizar
    requestAnimationFrame(() => {
      if (source === "visual") {
        // Calcula a porcentagem do scroll (scrollTop / altura total "rolável")
        const percentage =
          vContainer.scrollTop / (vContainer.scrollHeight - vContainer.clientHeight);
        // Aplica a mesma porcentagem ao outro container
        mContainer.scrollTop = percentage * (mContainer.scrollHeight - mContainer.clientHeight);
      } else {
        const percentage =
          mContainer.scrollTop / (mContainer.scrollHeight - mContainer.clientHeight);
        vContainer.scrollTop = percentage * (vContainer.scrollHeight - vContainer.clientHeight);
      }

      // Libera a trava após um breve momento para permitir novo scroll manual
      setTimeout(() => {
        isProgrammaticScroll = false;
      }, 50);
    });
  };

  // Gerencia a adição/remoção dos listeners de scroll no DOM real
  watchEffect((onCleanup) => {
    // Limpa listeners anteriores se houver
    if (unregisterListeners) unregisterListeners();

    // Só ativa se estiver no modo split e com sync ligado
    if (currentMode.value === "split" && isSyncScrollEnabled.value) {
      nextTick(() => {
        const vEl = visualEditorRef.value?.scrollContainer;
        const mEl = markdownEditorRef.value?.scrollContainer;

        if (!vEl || !mEl) return;

        const handleVScroll = () => syncScroll("visual");
        const handleMScroll = () => syncScroll("markdown");

        vEl.addEventListener("scroll", handleVScroll, { passive: true });
        mEl.addEventListener("scroll", handleMScroll, { passive: true });

        // Função de limpeza chamada quando o watchEffect roda novamente ou o componente desmonta
        unregisterListeners = () => {
          vEl.removeEventListener("scroll", handleVScroll);
          mEl.removeEventListener("scroll", handleMScroll);
        };
        // Sincroniza uma vez ao ativar para alinhar o início
        syncScroll("visual");
      });
    }

    onCleanup(() => {
      if (unregisterListeners) unregisterListeners();
    });
  });

  onBeforeUnmount(() => {
    if (unregisterListeners) unregisterListeners();
  });
</script>

<template>
  <div class="min-h-screen bg-black py-0 px-4 w-full">
    <div class="max-w-[90%] mx-auto mb-6">
      <div
        class="flex items-center justify-between bg-zinc-900 p-4 rounded-xl shadow-lg shadow-fuchsia-900/10 border border-zinc-800"
      >
        <div class="flex items-center gap-3">
          <button
            @click="currentMode = 'visual'"
            :class="
              currentMode === 'visual'
                ? 'bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-500/25'
                : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700 hover:text-gray-200'
            "
            class="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:shadow-md"
          >
            <FileText :size="18" /> Visual
          </button>
          <button
            @click="currentMode = 'markdown'"
            :class="
              currentMode === 'markdown'
                ? 'bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-500/25'
                : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700 hover:text-gray-200'
            "
            class="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:shadow-md"
          >
            <Code :size="18" /> Markdown
          </button>
          <button
            @click="currentMode = 'split'"
            :class="
              currentMode === 'split'
                ? 'bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-500/25'
                : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700 hover:text-gray-200'
            "
            class="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:shadow-md"
          >
            <SplitSquareHorizontal :size="18" /> Dividido
          </button>
        </div>

        <div v-if="currentMode === 'split'" class="border-l pl-3 ml-3 border-zinc-700">
          <button
            @click="isSyncScrollEnabled = !isSyncScrollEnabled"
            :class="
              isSyncScrollEnabled
                ? 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/50'
                : 'bg-zinc-800 text-gray-400 border-zinc-700 hover:bg-zinc-700'
            "
            class="flex items-center gap-2 px-3 py-2 rounded-lg border transition-all"
            :title="
              isSyncScrollEnabled ? 'Desativar scroll sincronizado' : 'Ativar scroll sincronizado'
            "
          >
            <component :is="isSyncScrollEnabled ? Link2 : Link2Off" :size="18" />
            <span class="text-sm font-medium hidden sm:inline">Sync Scroll</span>
          </button>
        </div>
      </div>
    </div>

    <div :class="currentMode === 'split' ? 'max-w-[90%] mx-auto' : 'max-w-7xl mx-auto'">
      <div v-if="currentMode === 'visual'" class="max-w-4xl mx-auto">
        <VisualEditor v-model="content" @update:model-value="updateContent" />
      </div>

      <div v-else-if="currentMode === 'markdown'" class="max-w-4xl mx-auto">
        <MarkdownEditor v-model="content" @update:model-value="updateContent" />
      </div>

      <div v-else-if="currentMode === 'split'" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div class="min-w-0">
          <h3 class="text-sm font-semibold text-zinc-400 mb-3 flex items-center gap-2">
            <FileText :size="16" /> Editor Visual
          </h3>
          <VisualEditor
            ref="visualEditorRef"
            v-model="content"
            @update:model-value="updateContent"
          />
        </div>

        <div class="min-w-0">
          <h3 class="text-sm font-semibold text-zinc-400 mb-3 flex items-center gap-2">
            <Code :size="16" /> Código Markdown
          </h3>
          <MarkdownEditor
            ref="markdownEditorRef"
            v-model="content"
            @update:model-value="updateContent"
          />
        </div>
      </div>
    </div>
  </div>
</template>
