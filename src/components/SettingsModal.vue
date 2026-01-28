<script setup lang="ts">
  import { useSettings } from "../composables/useSettings";
  import { X, Key, Cpu, Save } from "lucide-vue-next";

  const { apiKey, selectedModel, isSettingsOpen, AVAILABLE_MODELS } = useSettings();

  const close = () => {
    isSettingsOpen.value = false;
  };
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isSettingsOpen"
        class="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        @click.self="close"
      >
        <div
          class="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden"
        >
          <div
            class="px-6 py-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950"
          >
            <h3 class="font-bold text-zinc-100 flex items-center gap-2">Configurações</h3>
            <button @click="close" class="text-zinc-500 hover:text-white transition-colors">
              <X :size="20" />
            </button>
          </div>

          <div class="p-6 space-y-6">
            <div class="space-y-2">
              <label
                class="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2"
              >
                <Key :size="14" /> OpenAI API Key
              </label>
              <input
                v-model="apiKey"
                type="password"
                placeholder="sk-..."
                class="w-full bg-black/50 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-200 focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500/50 transition-all font-mono text-sm"
              />
              <p class="text-[10px] text-zinc-600">
                Sua chave é salva apenas no seu navegador (localStorage).
              </p>
            </div>

            <div class="space-y-2">
              <label
                class="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2"
              >
                <Cpu :size="14" /> Modelo IA
              </label>
              <div class="relative">
                <select
                  v-model="selectedModel"
                  class="w-full bg-black/50 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-200 focus:outline-none focus:border-fuchsia-500 appearance-none cursor-pointer"
                >
                  <option v-for="model in AVAILABLE_MODELS" :key="model.id" :value="model.id">
                    {{ model.name }}
                  </option>
                </select>
                <div
                  class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div class="px-6 py-4 bg-zinc-950 border-t border-zinc-800 flex justify-end">
            <button
              @click="close"
              class="bg-zinc-100 hover:bg-white text-zinc-900 px-6 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
            >
              <Save :size="16" /> Salvar e Fechar
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
