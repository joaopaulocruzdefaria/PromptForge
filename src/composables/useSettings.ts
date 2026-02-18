import { ref, watch } from "vue";

// Definição dos modelos disponíveis
export const AVAILABLE_MODELS = [
  { id: "gpt-4.1", name: "gpt-4.1" },
  { id: "gpt-5.1", name: "gpt-5.1" },
  { id: "gpt-5.2", name: "gpt-5.2" },
];

// Estado Global (fora da função para ser Singleton)
const apiKey = ref(localStorage.getItem("pf_api_key") || "");
const selectedModel = ref(localStorage.getItem("pf_model") || "gpt-4.1");
const isSettingsOpen = ref(false);

// Registra UMA VEZ no nível do módulo
watch(apiKey, (newVal) => localStorage.setItem("pf_api_key", newVal));
watch(selectedModel, (newVal) => localStorage.setItem("pf_model", newVal));

export function useSettings() {
  const toggleSettings = () => {
    isSettingsOpen.value = !isSettingsOpen.value;
  };

  return {
    apiKey,
    selectedModel,
    isSettingsOpen,
    toggleSettings,
    AVAILABLE_MODELS,
  };
}
