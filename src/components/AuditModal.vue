<script setup lang="ts">
  import { ref } from "vue";
  import { SearchCode, X, AlertCircle, Loader2 } from "lucide-vue-next";

  defineProps<{
    isOpen: boolean;
  }>();

  const emit = defineEmits<{
    (e: "close"): void;
    (e: "confirm"): void; // Novo evento
  }>();

  const isLoading = ref(false);

  const handleConfirm = () => {
    isLoading.value = true;
    emit("confirm");
    // O loading será resetado pelo pai quando o processo acabar ou fechar o modal
    setTimeout(() => {
      isLoading.value = false;
    }, 10000); // Fail-safe apenas visual
  };
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
        @click="!isLoading && emit('close')"
      >
        <div
          class="w-full max-w-lg bg-zinc-900 border border-purple-500/30 rounded-2xl shadow-2xl shadow-purple-900/20 overflow-hidden transform transition-all relative"
          @click.stop
        >
          <div
            class="px-6 py-4 bg-linear-to-r from-purple-900/30 to-fuchsia-900/10 border-b border-purple-500/20 flex items-center justify-between"
          >
            <div class="flex items-center gap-3 text-purple-200">
              <div class="p-2 bg-purple-500/20 rounded-lg border border-purple-500/30">
                <SearchCode class="w-5 h-5 text-purple-300" />
              </div>
              <h3 class="text-lg font-semibold tracking-wide">Auditoria de Prompt</h3>
            </div>

            <button
              @click="emit('close')"
              :disabled="isLoading"
              class="text-zinc-400 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors disabled:opacity-50"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <div class="p-6 space-y-4">
            <p class="text-zinc-400 text-sm leading-relaxed">
              Iniciando processo de auditoria. A IA irá analisar seu prompt e sugerir reescritas
              para melhorar clareza, contexto e estrutura.
            </p>

            <div
              class="bg-black/40 rounded-xl p-4 border border-purple-500/10 flex gap-3 items-start"
            >
              <AlertCircle class="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <div class="space-y-1">
                <span class="text-sm font-medium text-purple-200">Pronto para auditar</span>
                <p class="text-xs text-zinc-500">
                  Isso usará a API da OpenAI para gerar uma versão otimizada.
                </p>
              </div>
            </div>
          </div>

          <div class="px-6 py-4 bg-zinc-950/50 border-t border-white/5 flex justify-end gap-3">
            <button
              @click="emit('close')"
              :disabled="isLoading"
              class="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              @click="handleConfirm"
              :disabled="isLoading"
              class="px-4 py-2 text-sm font-medium bg-linear-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white rounded-lg shadow-lg shadow-purple-900/50 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
              {{ isLoading ? "Analisando..." : "Iniciar Auditoria" }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
