<script setup lang="ts">
import { SearchCode, X, AlertCircle } from "lucide-vue-next";

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
        class="fixed inset-0 60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        @click="emit('close')"
      >
        <div
          class="w-full max-w-lg bg-zinc-900 border border-purple-500/30 rounded-2xl shadow-2xl shadow-purple-900/20 overflow-hidden transform transition-all relative"
          @click.stop
        >
          <div class="px-6 py-4 bg-linear-to-r from-purple-900/30 to-fuchsia-900/10 border-b border-purple-500/20 flex items-center justify-between">
            <div class="flex items-center gap-3 text-purple-200">
              <div class="p-2 bg-purple-500/20 rounded-lg border border-purple-500/30">
                <SearchCode class="w-5 h-5 text-purple-300" />
              </div>
              <h3 class="text-lg font-semibold tracking-wide">Auditoria de Código</h3>
            </div>
            
            <button 
              @click="emit('close')"
              class="text-zinc-400 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <div class="p-6 space-y-4">
            <p class="text-zinc-400 text-sm leading-relaxed">
              Iniciando processo de auditoria. Isso irá verificar inconsistências, padrões de segurança e otimizações no código atual.
            </p>
            
            <div class="bg-black/40 rounded-xl p-4 border border-purple-500/10 flex gap-3 items-start">
              <AlertCircle class="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <div class="space-y-1">
                <span class="text-sm font-medium text-purple-200">Pronto para auditar</span>
                <p class="text-xs text-zinc-500">Nenhum problema crítico detectado na pré-análise.</p>
              </div>
            </div>
          </div>

          <div class="px-6 py-4 bg-zinc-950/50 border-t border-white/5 flex justify-end gap-3">
            <button
              @click="emit('close')"
              class="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              class="px-4 py-2 text-sm font-medium bg-linear-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white rounded-lg shadow-lg shadow-purple-900/50 transition-all active:scale-95"
            >
              Iniciar Auditoria
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>