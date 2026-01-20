<script setup lang="ts">
  import { ScanSearch, X, Sparkles } from "lucide-vue-next";

  defineProps<{
    isOpen: boolean;
  }>();

  const emit = defineEmits<{
    (e: "close"): void;
  }>();
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
        class="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        @click="emit('close')"
      >
        <div
          class="w-full max-w-lg bg-zinc-900 border border-zinc-700/50 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden transform transition-all relative"
          @click.stop
        >
          <div
            class="px-6 py-4 bg-zinc-800/30 border-b border-zinc-700/50 flex items-center justify-between"
          >
            <div class="flex items-center gap-3 text-zinc-100">
              <div class="p-2 bg-zinc-800 rounded-lg border border-zinc-600/50">
                <ScanSearch class="w-5 h-5 text-zinc-300" />
              </div>
              <h3 class="text-lg font-semibold tracking-wide">Analisar Prompt</h3>
            </div>

            <button
              @click="emit('close')"
              class="text-zinc-500 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <div class="p-6 space-y-4">
            <p class="text-zinc-400 text-sm leading-relaxed">
              A análise estrutural irá verificar a clareza, tokens e potenciais ambiguidades do seu
              texto atual.
            </p>

            <div class="grid grid-cols-2 gap-3">
              <div class="bg-zinc-950 p-3 rounded-lg border border-zinc-800 text-center">
                <span class="block text-xs text-zinc-500 mb-1">Tokens Estimados</span>
                <span class="text-xl font-mono text-zinc-200">~142</span>
              </div>
              <div class="bg-zinc-950 p-3 rounded-lg border border-zinc-800 text-center">
                <span class="block text-xs text-zinc-500 mb-1">Complexidade</span>
                <span class="text-xl font-mono text-emerald-400">Baixa</span>
              </div>
            </div>
          </div>

          <div class="px-6 py-4 bg-zinc-950/30 border-t border-white/5 flex justify-end gap-3">
            <button
              @click="emit('close')"
              class="px-4 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Fechar
            </button>
            <button
              class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-zinc-100 text-zinc-900 hover:bg-white rounded-lg shadow-lg transition-all active:scale-95"
            >
              <Sparkles class="w-4 h-4" />
              Gerar Relatório
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
