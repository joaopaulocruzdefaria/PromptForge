<script setup lang="ts">
  import { ref } from "vue";
  import { Settings } from "lucide-vue-next"; // Importe o ícone

  import DualEditorView from "./components/DualEditorView.vue";
  import AnalyzeButton from "./components/AnalyzeButton.vue";
  import AnalyzeModal from "./components/AnalyzeModal.vue";
  import SettingsModal from "./components/SettingsModal.vue";
  import Logo from "./components/Logo.vue";

  import { useSettings } from "./composables/useSettings";

  const { toggleSettings } = useSettings();

  // Estado central do prompt
  const currentPrompt = ref("# Contexto Inicial\nDigite seu prompt aqui...");

  // Modais
  const showAnalyze = ref(false);

  const handleContentUpdate = (newText: string) => {
    currentPrompt.value = newText;
  };
</script>

<template>
  <div id="App" class="bg-black min-h-screen relative">
    <div class="fixed bottom-43 right-10 z-50 flex flex-col gap-3">
      <button
        @click="toggleSettings"
        class="w-12 h-12 flex items-center justify-center bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full shadow-xl transition-all group"
        title="Configurações da API"
      >
        <Settings :size="20" class="group-hover:rotate-90 transition-transform duration-500" />
      </button>

      <AnalyzeButton @click="showAnalyze = true" />
    </div>

    <AnalyzeModal
      :isOpen="showAnalyze"
      :promptContent="currentPrompt"
      @close="showAnalyze = false"
    />
    <SettingsModal />

    <Logo />

    <DualEditorView
      :initial-content="currentPrompt"
      mode="split"
      @update:content="handleContentUpdate"
    />
  </div>
</template>
