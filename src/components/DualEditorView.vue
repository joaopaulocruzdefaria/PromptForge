<script setup lang="ts">
  import { ref, watchEffect, nextTick, onBeforeUnmount } from "vue";
  import VisualEditor from "./VisualEditor.vue";
  import MarkdownEditor from "./MarkdownEditor.vue";
  import AuditModal from "./AuditModal.vue";
  import DiffModal from "./DiffModal.vue";
  import AuditButton from "./AuditButton.vue";
  import { useSettings } from "../composables/useSettings"; // Importação correta
  import {
    FileText,
    Code,
    SplitSquareHorizontal,
    Link2,
    Link2Off,
  } from "lucide-vue-next";

  const props = defineProps<{
    initialContent?: string;
    mode?: "visual" | "markdown" | "split";
  }>();

  const emit = defineEmits<{
    "update:content": [value: string];
  }>();

  // --- Setup do Composable de Configurações (CORREÇÃO 1) ---
  const { apiKey, selectedModel, toggleSettings } = useSettings();

  const content = ref(props.initialContent || "# Contexto Inicial\nDigite seu prompt aqui...");
  const currentMode = ref(props.mode || "visual");
  const isSyncScrollEnabled = ref(false);

  // --- Estados para Auditoria ---
  const isAuditModalOpen = ref(false);
  const isDiffModalOpen = ref(false);
  const optimizedContent = ref("");
  const isAuditing = ref(false); // Estado de Loading para UX

  // --- Lógica de Auditoria ---
  const openAudit = () => {
    isAuditModalOpen.value = true;
  };

  const handleRunAudit = async () => {
    // Validação da Chave
    if (!apiKey.value) {
      alert("⚠️ Configure sua chave de API para continuar.");
      isAuditModalOpen.value = false;
      toggleSettings(); // Abre settings
      return;
    }

    isAuditing.value = true; // Ativa loading

    try {
      const response = await fetch("/api/optimize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey.value,
          "x-model": selectedModel.value,
        },
        body: JSON.stringify({ prompt: content.value }),
      });

      if (response.status === 401) {
        const errorData = await response.json();

        // Mostra a mensagem bonita que definimos no server.ts
        alert(errorData.message || "Erro de autenticação.");

        isAuditModalOpen.value = false;
        toggleSettings(); // Abre settings automaticamente para o usuário corrigir
        return;
      }

      const data = await response.json(); // (CORREÇÃO 2: Ler o JSON)

      if (!response.ok) throw new Error(data.error || "Erro na requisição");

      if (data.optimizedPrompt) {
        optimizedContent.value = data.optimizedPrompt;

        // (CORREÇÃO 3: Fluxo de Sucesso)
        isAuditModalOpen.value = false; // Fecha a confirmação
        isDiffModalOpen.value = true; // Abre o Diff
      }
    } catch (error) {
      console.error("Erro ao auditar:", error);
      alert("Erro ao conectar com a API. Verifique o console.");
    } finally {
      isAuditing.value = false; // Desativa loading
    }
  };

  const handleAcceptChanges = (newText: string) => {
    updateContent(newText);
    isDiffModalOpen.value = false;
  };

  const visualEditorRef = ref<InstanceType<typeof VisualEditor> | null>(null);
  const markdownEditorRef = ref<InstanceType<typeof MarkdownEditor> | null>(null);

  const updateContent = (newContent: string) => {
    content.value = newContent;
    emit("update:content", newContent);
  };

  // --- Lógica de Scroll Sincronizado (Mantida igual, está ótima) ---
  let isProgrammaticScroll = false;
  let unregisterListeners: (() => void) | null = null;

  const syncScroll = (source: "visual" | "markdown") => {
    if (!isSyncScrollEnabled.value || isProgrammaticScroll || currentMode.value !== "split") return;
    const vContainer = visualEditorRef.value?.scrollContainer;
    const mContainer = markdownEditorRef.value?.scrollContainer;
    if (!vContainer || !mContainer) return;
    isProgrammaticScroll = true;
    requestAnimationFrame(() => {
      if (source === "visual") {
        const percentage =
          vContainer.scrollTop / (vContainer.scrollHeight - vContainer.clientHeight);
        mContainer.scrollTop = percentage * (mContainer.scrollHeight - mContainer.clientHeight);
      } else {
        const percentage =
          mContainer.scrollTop / (mContainer.scrollHeight - mContainer.clientHeight);
        vContainer.scrollTop = percentage * (vContainer.scrollHeight - vContainer.clientHeight);
      }
      setTimeout(() => {
        isProgrammaticScroll = false;
      }, 50);
    });
  };

  watchEffect((onCleanup) => {
    if (unregisterListeners) unregisterListeners();
    if (currentMode.value === "split" && isSyncScrollEnabled.value) {
      nextTick(() => {
        const vEl = visualEditorRef.value?.scrollContainer;
        const mEl = markdownEditorRef.value?.scrollContainer;
        if (!vEl || !mEl) return;
        const handleVScroll = () => syncScroll("visual");
        const handleMScroll = () => syncScroll("markdown");
        vEl.addEventListener("scroll", handleVScroll, { passive: true });
        mEl.addEventListener("scroll", handleMScroll, { passive: true });
        unregisterListeners = () => {
          vEl.removeEventListener("scroll", handleVScroll);
          mEl.removeEventListener("scroll", handleMScroll);
        };
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
  <div class="min-h-screen bg-black py-0 px-4 w-full relative">
    <div class="sticky top-6 z-30 mb-8 max-w-[98%] mx-auto">
      <div class="grid grid-cols-12 items-center">
        <div class="col-span-3"></div>

        <div class="col-span-6 flex justify-center">
          <div class="relative flex items-center">
            <div
              class="flex p-1.5 bg-zinc-900/80 backdrop-blur-md border border-zinc-800/60 rounded-full shadow-2xl shadow-black/50"
            >
              <button
                @click="currentMode = 'visual'"
                class="relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2"
                :class="
                  currentMode === 'visual'
                    ? 'bg-zinc-800 text-white shadow-lg ring-1 ring-white/10'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
                "
              >
                <FileText :size="16" :class="currentMode === 'visual' ? 'text-fuchsia-400' : ''" />
                Visual
              </button>

              <button
                @click="currentMode = 'markdown'"
                class="relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2"
                :class="
                  currentMode === 'markdown'
                    ? 'bg-zinc-800 text-white shadow-lg ring-1 ring-white/10'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
                "
              >
                <Code :size="16" :class="currentMode === 'markdown' ? 'text-fuchsia-400' : ''" />
                Markdown
              </button>

              <button
                @click="currentMode = 'split'"
                class="relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2"
                :class="
                  currentMode === 'split'
                    ? 'bg-zinc-800 text-white shadow-lg ring-1 ring-white/10'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
                "
              >
                <SplitSquareHorizontal
                  :size="16"
                  :class="currentMode === 'split' ? 'text-fuchsia-400' : ''"
                />
                Dividido
              </button>
            </div>

            <Transition
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 -translate-x-4 scale-90"
              enter-to-class="opacity-100 translate-x-0 scale-100"
              leave-active-class="transition-all duration-200 ease-in"
              leave-from-class="opacity-100 translate-x-0 scale-100"
              leave-to-class="opacity-0 -translate-x-4 scale-90"
            >
              <div
                v-if="currentMode === 'split'"
                class="absolute left-[104%] top-1/2 -translate-y-1/2 ml-2 hidden sm:block"
              >
                <button
                  @click="isSyncScrollEnabled = !isSyncScrollEnabled"
                  class="flex items-center justify-center p-2.5 rounded-full border shadow-lg backdrop-blur-md transition-all duration-300 group whitespace-nowrap"
                  :class="
                    isSyncScrollEnabled
                      ? 'bg-zinc-900 border-fuchsia-500/50 text-fuchsia-400 shadow-fuchsia-900/20'
                      : 'bg-zinc-900/80 border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'
                  "
                  title="Sincronizar Rolagem"
                >
                  <component
                    :is="isSyncScrollEnabled ? Link2 : Link2Off"
                    :size="18"
                    class="transition-transform duration-300 group-hover:scale-110"
                  />
                </button>
              </div>
            </Transition>
          </div>
        </div>

        <div class="col-span-3"></div>
      </div>
    </div>

    <AuditModal
      :isOpen="isAuditModalOpen"
      :isLoading="isAuditing"
      @close="!isAuditing && (isAuditModalOpen = false)"
      @confirm="handleRunAudit"
    />

    <DiffModal
      :isOpen="isDiffModalOpen"
      :originalText="content"
      :newText="optimizedContent"
      @close="isDiffModalOpen = false"
      @accept="handleAcceptChanges"
    />

    <div :class="currentMode === 'split' ? 'max-w-[95%] mx-auto' : 'max-w-5xl mx-auto'">
      <div v-show="currentMode === 'visual'" class="animate-in fade-in zoom-in-95 duration-300">
        <VisualEditor v-model="content" @update:model-value="updateContent" />
      </div>

      <div v-show="currentMode === 'markdown'" class="animate-in fade-in zoom-in-95 duration-300">
        <MarkdownEditor v-model="content" @update:model-value="updateContent" />
      </div>

      <div
        v-show="currentMode === 'split'"
        class="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in zoom-in-95 duration-300"
      >
        <div class="flex flex-col h-full">
          <div
            class="mb-3 px-2 flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-wider"
          >
            <span class="w-2 h-2 rounded-full bg-fuchsia-500/50"></span>
            Editor Visual
          </div>
          <VisualEditor
            ref="visualEditorRef"
            v-model="content"
            @update:model-value="updateContent"
            class="flex-1"
          />
        </div>

        <div class="flex flex-col h-full">
          <div
            class="mb-3 px-2 flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-wider"
          >
            <span class="w-2 h-2 rounded-full bg-blue-500/50"></span>
            Código Markdown
          </div>
          <MarkdownEditor
            ref="markdownEditorRef"
            v-model="content"
            @update:model-value="updateContent"
            class="flex-1"
          />
        </div>
      </div>
    </div>

    <AuditButton @audit="openAudit" :isLoading="isAuditing" />
  </div>
</template>
