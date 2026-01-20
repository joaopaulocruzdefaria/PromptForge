<script setup>
  import PromptEditor from "./components/PromptEditor.vue";
  import DualEditorView from "./components/DualEditorView.vue";
  import AuditButton from "./components/AuditButton.vue";
  import AnalyzeButton from "./components/AnalyzeButton.vue";
  import AnalyzeModal from "./components/AnalyzeModal.vue";
  import AuditModal from "./components/AuditModal.vue";
  import { ref } from "vue";
  import { Wand2, Search, Copy, Check, AlertCircle, Loader2, Terminal } from "lucide-vue-next";
  import Logo from "./components/Logo.vue";

  const copyToClipboard = async () => {
    if (!optimizedResult.value) return;
    try {
      await navigator.clipboard.writeText(optimizedResult.value);
      showCopied.value = true;
      setTimeout(() => (showCopied.value = false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const showAudit = ref(false);
  const showAnalyze = ref(false);
</script>
<template>
  <div id="App" class="bg-black">
    <div>
      <AuditButton @audit="showAudit = true" />
      <AnalyzeButton @click="showAnalyze = true" />
      <AuditModal :is-open="showAudit" @close="showAudit = false" />
      <AnalyzeModal :is-open="showAnalyze" @close="showAnalyze = false" />
    </div>

    <Logo />
    <DualEditorView
      :initial-content="promptContent"
      mode="split"
      @update:content="handleContentUpdate"
    />
  </div>
</template>
<style scoped>
  /* Custom scrollbar for the textarea and result areas */
  textarea::-webkit-scrollbar,
  div::-webkit-scrollbar {
    width: 8px;
  }
  textarea::-webkit-scrollbar-track,
  div::-webkit-scrollbar-track {
    background: #0f172a;
  }
  textarea::-webkit-scrollbar-thumb,
  div::-webkit-scrollbar-thumb {
    background: #334155;
    border-radius: 4px;
  }
  textarea::-webkit-scrollbar-thumb:hover,
  div::-webkit-scrollbar-thumb:hover {
    background: #475569;
  }
</style>
