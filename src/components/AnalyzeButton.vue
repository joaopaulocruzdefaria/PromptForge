<script setup>
import { ScanSearch } from 'lucide-vue-next' // Ícone de "Escanear/Analisar"

const emit = defineEmits(['click'])
</script>

<template>
  <button 
    @click="emit('click')"
    class="group fixed bottom-28 right-10 z-40 flex items-center justify-center 
           w-12 h-12 rounded-full 
           bg-gray-900/80 backdrop-blur-sm
           text-gray-400 
           border border-white/10
           shadow-lg shadow-black/50
           transition-all duration-300 ease-out
           hover:scale-110 hover:bg-gray-800 hover:text-purple-300 hover:border-purple-500/30
           active:scale-95"
  >
    <ScanSearch class="w-6 h-6" />
    
    <span class="absolute right-[115%] top-1/2 -translate-y-1/2
                 px-3 py-1.5
                 bg-gray-900 border border-white/10 text-gray-300
                 text-xs font-medium rounded-lg shadow-xl
                 whitespace-nowrap
                 opacity-0 group-hover:opacity-100
                 translate-x-4 group-hover:translate-x-0
                 transition-all duration-300 pointer-events-none">
       Analisar Prompt
       
       <span class="absolute top-1/2 -right-1 -translate-y-1/2 
                    border-4 border-transparent border-l-gray-900"></span>
    </span>
  </button>
</template>