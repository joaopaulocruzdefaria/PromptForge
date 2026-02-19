import { ref, watch } from "vue";

export interface HistoryItem {
  id: string;
  timestamp: number;
  original: string;
  optimized: string;
  model: string;
}

const STORAGE_KEY_DRAFT = "pf_current_draft";
const STORAGE_KEY_HISTORY = "pf_history";
const MAX_HISTORY_ITEMS = 50;

// Estado Global (Singleton)
const currentDraft = ref(
  localStorage.getItem(STORAGE_KEY_DRAFT) || "# Contexto Inicial\nDigite seu prompt aqui..."
);

const history = ref<HistoryItem[]>([]);

// Carregar histórico inicial
try {
  const savedHistory = localStorage.getItem(STORAGE_KEY_HISTORY);
  if (savedHistory) {
    history.value = JSON.parse(savedHistory);
  }
} catch (e) {
  console.error("Erro ao carregar histórico:", e);
  history.value = [];
}

// Watchers para persistência
watch(currentDraft, (newValue) => {
  localStorage.setItem(STORAGE_KEY_DRAFT, newValue);
});

watch(
  history,
  (newValue) => {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(newValue));
  },
  { deep: true }
);

export function useHistory() {
  const addToHistory = (original: string, optimized: string, model: string) => {
    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      original,
      optimized,
      model,
    };

    history.value.unshift(newItem);

    // Limitar tamanho do histórico
    if (history.value.length > MAX_HISTORY_ITEMS) {
      history.value = history.value.slice(0, MAX_HISTORY_ITEMS);
    }
  };

  const deleteFromHistory = (id: string) => {
    history.value = history.value.filter((item) => item.id !== id);
  };

  const clearHistory = () => {
    history.value = [];
  };

  const restoreDraft = (text: string) => {
    currentDraft.value = text;
  };

  return {
    currentDraft,
    history,
    addToHistory,
    deleteFromHistory,
    clearHistory,
    restoreDraft,
  };
}
