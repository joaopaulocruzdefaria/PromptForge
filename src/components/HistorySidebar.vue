<script setup lang="ts">
  import { X, History, Trash2, Reply } from "lucide-vue-next";
  import { useHistory } from "../composables/useHistory";
  import type { HistoryItem } from "../composables/useHistory";

  defineProps<{
    isOpen: boolean;
  }>();

  const emit = defineEmits<{
    (e: "close"): void;
  }>();

  const { history, restoreDraft, deleteFromHistory } = useHistory();

  const handleRestore = (item: HistoryItem) => {
    // Confirmação para evitar perda acidental do trabalho atual
    if (confirm("Restaurar este prompt substituirá o conteúdo atual. Deseja continuar?")) {
      restoreDraft(item.optimized); // Ou item.original, dependendo da UX desejada
      emit("close");
    }
  };

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(timestamp));
  };
</script>

<template>
  <div class="z-50 pointer-events-none fixed inset-0 overflow-hidden" v-if="isOpen">
    <div class="absolute inset-0 overflow-hidden">
      <!-- Overlay (clique fecha) -->
      <div
        class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity pointer-events-auto"
        @click="emit('close')"
      ></div>

      <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div
          class="pointer-events-auto w-screen max-w-md transform transition-transform duration-300 ease-in-out bg-zinc-950 border-l border-zinc-800 shadow-2xl flex flex-col h-full"
        >
          <!-- Header -->
          <div
            class="flex h-16 shrink-0 items-center justify-between px-6 border-b border-zinc-800 bg-zinc-900/50"
          >
            <h2 class="text-base font-semibold text-zinc-100 flex items-center gap-2">
              <History :size="20" class="text-fuchsia-400" />
              Histórico de Otimizações
            </h2>
            <button
              @click="emit('close')"
              class="rounded-md text-zinc-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            >
              <X :size="24" />
            </button>
          </div>

          <!-- List -->
          <div class="flex-1 overflow-y-auto p-6 space-y-4">
            <div v-if="history.length === 0" class="text-center py-10 text-zinc-500">
              <History :size="48" class="mx-auto mb-4 opacity-20" />
              <p>Nenhum histórico encontrado.</p>
              <p class="text-sm mt-2">Otimize um prompt para vê-lo aqui.</p>
            </div>

            <div
              v-for="item in history"
              :key="item.id"
              class="group relative bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-all hover:shadow-lg hover:bg-zinc-800/50"
            >
              <div class="flex justify-between items-start mb-2">
                <span
                  class="text-[10px] font-bold uppercase tracking-wider text-zinc-500 bg-zinc-950 px-2 py-1 rounded"
                >
                  {{ item.model }}
                </span>
                <span class="text-xs text-zinc-500 font-mono">{{
                  formatDate(item.timestamp)
                }}</span>
              </div>

              <div class="mb-4">
                <p
                  class="text-sm text-zinc-300 line-clamp-3 font-mono leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity"
                >
                  {{ item.optimized }}
                </p>
              </div>

              <div
                class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <button
                  @click.stop="deleteFromHistory(item.id)"
                  class="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors"
                  title="Excluir"
                >
                  <Trash2 :size="16" />
                </button>
                <button
                  @click="handleRestore(item)"
                  class="flex items-center gap-2 px-3 py-2 bg-fuchsia-600/10 hover:bg-fuchsia-600/20 text-fuchsia-400 text-xs font-bold rounded-lg border border-fuchsia-600/20 hover:border-fuchsia-600/40 transition-all"
                >
                  <Reply :size="14" />
                  Restaurar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
