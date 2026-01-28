<script setup lang="ts">
import { ref, computed } from "vue";
import { ScanSearch, X, Sparkles, Loader2, Gauge, CheckCircle2 } from "lucide-vue-next";
import { useSettings } from "../composables/useSettings"; // <--- Importação adicionada

const props = defineProps<{
  isOpen: boolean;
  promptContent: string;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

// --- Integração com Configurações ---
const { apiKey, selectedModel, toggleSettings } = useSettings();

const isAnalyzing = ref(false);
const analysisResult = ref<string[] | null>(null);
const score = ref<number | null>(null);

const estimatedTokens = computed(() => {
  if (!props.promptContent) return 0;
  return Math.ceil(props.promptContent.length / 4);
});

const scoreColor = computed(() => {
  if (!score.value) return "bg-zinc-700";
  if (score.value >= 90) return "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]";
  if (score.value >= 70) return "bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.4)]";
  if (score.value >= 50) return "bg-yellow-500";
  return "bg-red-500";
});

const scoreLabel = computed(() => {
  if (!score.value) return "Pendente";
  if (score.value >= 90) return "Excelente";
  if (score.value >= 70) return "Muito Bom";
  if (score.value >= 50) return "Regular";
  return "Precisa Melhorar";
});

const formatItem = (text: string) => {
  const parts = text.split(":");
  if (parts.length > 1) {
    return {
      title: parts[0],
      content: parts.slice(1).join(":"),
    };
  }
  return { title: null, content: text };
};

async function handleAnalyze() {
  if (!props.promptContent.trim()) return;

  // 1. Validação da Chave (Antes da requisição)
  if (!apiKey.value) {
    alert("⚠️ Por favor, configure sua chave de API para continuar.");
    emit("close"); // Fecha este modal
    toggleSettings(); // Abre o modal de configurações
    return;
  }

  isAnalyzing.value = true;
  analysisResult.value = null;
  score.value = null;

  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        // Envia as credenciais do usuário
        "x-api-key": apiKey.value,
        "x-model": selectedModel.value
      },
      body: JSON.stringify({ prompt: props.promptContent }),
    });

    // 2. Tratamento de Erro 401 (Chave inválida ou recusada)
    if (response.status === 401) {
      const errorData = await response.json();
      alert(errorData.message || "Erro de autenticação.");
      emit("close");
      toggleSettings();
      return;
    }

    const data = await response.json();

    if (Array.isArray(data.analysis)) {
      analysisResult.value = data.analysis;
    } else if (typeof data.analysis === "string") {
      analysisResult.value = [data.analysis];
    }

    score.value = data.score;
  } catch (error) {
    console.error("Erro:", error);
    analysisResult.value = ["Erro de conexão. Verifique o backend."];
  } finally {
    isAnalyzing.value = false;
  }
}
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
        class="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        @click="emit('close')"
      >
        <div
          class="w-full max-w-2xl bg-zinc-900 border border-zinc-700/50 rounded-2xl shadow-2xl shadow-black overflow-hidden flex flex-col max-h-[90vh]"
          @click.stop
        >
          <div
            class="px-6 py-5 bg-zinc-800/30 border-b border-zinc-700/50 flex items-center justify-between shrink-0"
          >
            <div class="flex items-center gap-3 text-zinc-100">
              <div class="p-2 bg-zinc-800 rounded-lg border border-zinc-600/50 shadow-inner">
                <ScanSearch class="w-6 h-6 text-fuchsia-400" />
              </div>
              <div>
                <h3 class="text-xl font-bold tracking-tight text-white">Análise de Prompt</h3>
                <p class="text-xs text-zinc-400">Avaliação técnica detalhada</p>
              </div>
            </div>
            <button
              @click="emit('close')"
              class="text-zinc-500 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <div class="p-8 space-y-8 overflow-y-auto custom-scrollbar bg-zinc-900/50">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                class="bg-zinc-950 p-5 rounded-xl border border-zinc-800/60 flex flex-col justify-between h-32"
              >
                <span class="text-xs font-bold text-zinc-500 uppercase tracking-widest"
                  >Estimativa</span
                >
                <div class="flex items-end gap-2">
                  <span class="text-5xl font-mono font-light text-zinc-200 tracking-tighter">{{
                    estimatedTokens
                  }}</span>
                  <span class="text-sm text-zinc-500 mb-1.5 font-medium">tokens</span>
                </div>
              </div>

              <div
                class="bg-zinc-950 p-5 rounded-xl border border-zinc-800/60 flex flex-col justify-between h-32 relative overflow-hidden group"
              >
                <div
                  class="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-3xl -translate-y-10 translate-x-10 group-hover:bg-white/10 transition-all"
                ></div>

                <div class="flex justify-between items-start z-10">
                  <span
                    class="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2"
                  >
                    Qualidade
                  </span>
                  <span
                    class="text-[10px] font-bold px-2 py-1 rounded-full border tracking-wide uppercase"
                    :class="
                      score
                        ? 'bg-zinc-900 border-zinc-700 text-zinc-300'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-600'
                    "
                  >
                    {{ scoreLabel }}
                  </span>
                </div>

                <div class="z-10 w-full">
                  <div class="flex items-end gap-1.5 mb-3">
                    <span
                      class="text-4xl font-bold tracking-tighter"
                      :class="score ? 'text-white' : 'text-zinc-700'"
                    >
                      {{ score !== null ? score : "--" }}
                    </span>
                    <span class="text-sm text-zinc-600 mb-1.5 font-medium">/100</span>
                  </div>

                  <div class="w-full h-1.5 bg-zinc-800/50 rounded-full overflow-hidden">
                    <div
                      class="h-full transition-all duration-1000 ease-out rounded-full shadow-lg"
                      :class="scoreColor"
                      :style="{ width: score ? `${score}%` : '0%' }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div
              v-if="analysisResult && analysisResult.length > 0"
              class="animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
              <div class="flex items-center gap-2 mb-4">
                <Sparkles class="w-4 h-4 text-fuchsia-500" />
                <h4 class="text-zinc-100 font-semibold text-sm uppercase tracking-wider">
                  Parecer Técnico
                </h4>
              </div>

              <div class="space-y-3">
                <div
                  v-for="(item, index) in analysisResult"
                  :key="index"
                  class="p-4 bg-zinc-950/40 rounded-xl border border-zinc-800/50 hover:border-zinc-700/50 transition-colors flex gap-4"
                >
                  <CheckCircle2 class="w-5 h-5 text-emerald-500/50 mt-0.5 shrink-0" />

                  <div class="text-sm leading-relaxed text-zinc-300">
                    <template v-if="formatItem(item).title">
                      <span class="text-zinc-100 font-bold block mb-1 text-base">{{
                        formatItem(item).title
                      }}</span>
                      <span class="text-zinc-400">{{ formatItem(item).content }}</span>
                    </template>
                    <template v-else>
                      {{ item }}
                    </template>
                  </div>
                </div>
              </div>
            </div>

            <div
              v-else-if="!isAnalyzing"
              class="py-12 text-center opacity-30 border-2 border-dashed border-zinc-800 rounded-xl"
            >
              <Sparkles class="w-10 h-10 mx-auto mb-3 text-zinc-500" />
              <p class="text-zinc-400 text-sm font-medium">Aguardando geração do relatório...</p>
            </div>
          </div>

          <div
            class="px-6 py-5 bg-zinc-950/80 border-t border-white/5 flex justify-end gap-3 shrink-0 backdrop-blur-md"
          >
            <button
              @click="emit('close')"
              class="px-5 py-2.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Fechar
            </button>
            <button
              @click="handleAnalyze"
              :disabled="isAnalyzing"
              class="flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-zinc-100 text-black hover:bg-white hover:scale-[1.02] rounded-lg shadow-lg shadow-white/5 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Loader2 v-if="isAnalyzing" class="w-4 h-4 animate-spin" />
              <Sparkles v-else class="w-4 h-4 fill-black" />
              {{ isAnalyzing ? "Analisando..." : "Gerar Relatório" }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>