<script setup lang="ts">
  import { ref } from "vue";
  import { Settings, History } from "lucide-vue-next";

  import DualEditorView from "./components/DualEditorView.vue";
  import AnalyzeButton from "./components/AnalyzeButton.vue";
  import AnalyzeModal from "./components/AnalyzeModal.vue";
  import SettingsModal from "./components/SettingsModal.vue";
  import HistorySidebar from "./components/HistorySidebar.vue"; // Novo
  import Logo from "./components/Logo.vue";

  import { useSettings } from "./composables/useSettings";
  import { useHistory } from "./composables/useHistory"; // Novo

  const { toggleSettings } = useSettings();
  const { currentDraft } = useHistory(); // Usando composable

  // Modais
  const showAnalyze = ref(false);
  const showHistory = ref(false); // Novo

  const handleContentUpdate = (newText: string) => {
    // Atualiza diretamente o ref do composable, que já tem watcher
    currentDraft.value = newText;
  };
</script>

<template>
  <div id="App" class="bg-black min-h-screen relative">
    <div class="fixed bottom-43 right-10 z-40 flex flex-col gap-3">
      <!-- Botão History -->
      <button
        @click="showHistory = true"
        class="w-12 h-12 flex items-center justify-center bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full shadow-xl transition-all group"
        title="Histórico de Versões"
      >
        <History :size="20" class="group-hover:scale-110 transition-transform duration-300" />
      </button>

      <!-- Botão Settings -->
      <button
        @click="toggleSettings"
        class="w-12 h-12 flex items-center justify-center bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full shadow-xl transition-all group"
        title="Configurações da API"
      >
        <Settings :size="20" class="group-hover:rotate-90 transition-transform duration-500" />
      </button>

      <AnalyzeButton @click="showAnalyze = true" />
    </div>

    <!-- Modais e Sidebars -->
    <AnalyzeModal
      :isOpen="showAnalyze"
      :promptContent="currentDraft"
      @close="showAnalyze = false"
    />
    <SettingsModal />

    <HistorySidebar :isOpen="showHistory" @close="showHistory = false" />

    <Logo />

    <!-- Editor Principal -->
    <DualEditorView
      :initial-content="currentDraft"
      mode="split"
      @update:content="handleContentUpdate"
    />
  </div>
</template>
