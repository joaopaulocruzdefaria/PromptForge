<script setup lang="ts">
  import { computed } from "vue";
  import { Check, X, GitCompare } from "lucide-vue-next";
  import DiffMatchPatch from "diff-match-patch";

  const props = defineProps<{
    isOpen: boolean;
    originalText: string;
    newText: string;
  }>();

  const emit = defineEmits<{
    (e: "close"): void;
    (e: "accept", content: string): void;
  }>();

  // Calcula o Diff apenas quando os textos mudam
  const diffs = computed(() => {
    const dmp = new DiffMatchPatch();
    const diff = dmp.diff_main(props.originalText, props.newText);
    dmp.diff_cleanupSemantic(diff); // Limpa para ficar mais legível para humanos
    return diff;
  });
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      >
        <div
          class="w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div
            class="px-6 py-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between shrink-0"
          >
            <div class="flex items-center gap-3">
              <div class="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <GitCompare class="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-zinc-100">Revisar Sugestões</h3>
                <p class="text-xs text-zinc-500">Verifique as alterações propostas pela IA</p>
              </div>
            </div>
          </div>

          <div class="p-6 overflow-y-auto custom-scrollbar bg-zinc-950/30">
            <div
              class="font-mono text-sm leading-relaxed whitespace-pre-wrap text-zinc-300 bg-black/40 p-6 rounded-xl border border-zinc-800/50"
            >
              <span v-for="(part, index) in diffs" :key="index">
                <span v-if="part[0] === 0">{{ part[1] }}</span>
                <span
                  v-else-if="part[0] === -1"
                  class="bg-red-900/40 text-red-200 line-through decoration-red-500/50 px-0.5 rounded-xs"
                  >{{ part[1] }}</span
                >
                <span
                  v-else-if="part[0] === 1"
                  class="bg-green-900/40 text-green-200 px-0.5 rounded-xs border-b border-green-500/30"
                  >{{ part[1] }}</span
                >
              </span>
            </div>
          </div>

          <div
            class="px-6 py-4 bg-zinc-900 border-t border-zinc-800 flex justify-end gap-3 shrink-0"
          >
            <button
              @click="emit('close')"
              class="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors flex items-center gap-2"
            >
              <X :size="16" />
              Descartar
            </button>
            <button
              @click="emit('accept', newText)"
              class="px-4 py-2 text-sm font-medium bg-green-600 hover:bg-green-500 text-white rounded-lg shadow-lg shadow-green-900/20 transition-all active:scale-95 flex items-center gap-2"
            >
              <Check :size="16" />
              Aceitar Alterações
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #3f3f46;
    border-radius: 4px;
  }
</style>
