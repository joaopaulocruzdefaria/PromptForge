<script setup>
import PromptEditor from './components/PromptEditor.vue'
import { ref } from 'vue'
import { 
  Wand2, 
  Search, 
  Copy, 
  Check, 
  AlertCircle, 
  Loader2,
  Terminal
} from 'lucide-vue-next'

// --- Variáveis de Estado (Ajustadas para bater com o seu HTML) ---
const companyContext = ref(`Tone: Professional but approachable.
Core Values: Transparency, Customer Success.
Restrictions: Avoid passive voice. Always provide clear next steps.`)

const originalPrompt = ref('')
const analysisResult = ref([])
const optimizedResult = ref('')
const isLoading = ref(false)
const hasResults = ref(false)
const activeTab = ref('analysis') // 'analysis' | 'optimized'
const showCopied = ref(false)

// --- Ação 1: AUDITAR (Conectado ao Backend) ---
const handleAudit = async () => {
  if (!originalPrompt.value) return
  
  isLoading.value = true
  hasResults.value = false
  activeTab.value = 'analysis' 
  
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: originalPrompt.value,
        context: companyContext.value
      })
    })

    const data = await response.json()

    if (data.analysis) {
      analysisResult.value = data.analysis
      optimizedResult.value = '' // Limpa o otimizado anterior para não confundir
      hasResults.value = true
    } else {
      console.error('Formato inválido:', data)
    }
  } catch (error) {
    console.error('Erro na requisição:', error)
    alert('Erro ao conectar com o servidor local.')
  } finally {
    isLoading.value = false
  }
}

// --- Ação 2: OTIMIZAR (Conectado ao Backend) ---
const handleOptimize = async () => {
  if (!originalPrompt.value) return

  isLoading.value = true
  hasResults.value = false
  activeTab.value = 'optimized'

  try {
    const response = await fetch('/api/optimize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: originalPrompt.value,
        context: companyContext.value
      })
    })

    const data = await response.json()

    if (data.optimizedPrompt) {
      // Dica: Se quiser que ele TAMBÉM analise ao mesmo tempo,
      // teríamos que mudar o backend. Por enquanto ele só reescreve.
      optimizedResult.value = data.optimizedPrompt
      hasResults.value = true
    }
  } catch (error) {
    console.error('Erro na requisição:', error)
    alert('Erro ao conectar com o servidor local.')
  } finally {
    isLoading.value = false
  }
}

const copyToClipboard = async () => {
  if (!optimizedResult.value) return
  try {
    await navigator.clipboard.writeText(optimizedResult.value)
    showCopied.value = true
    setTimeout(() => showCopied.value = false, 2000)
  } catch (err) {
    console.error('Failed to copy', err)
  }
}
</script>
<template>
  <PromptEditor></PromptEditor>
  <div class="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans selection:bg-emerald-500/30">
    
    <header class="max-w-7xl mx-auto mb-8 flex items-center gap-3 border-b border-slate-800 pb-6">
      <div class="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
        <Terminal class="w-6 h-6 text-emerald-400" />
      </div>
      <div>
        <h1 class="text-2xl font-bold text-white tracking-tight">Corporate Prompt Optimizer</h1>
        <p class="text-slate-400 text-sm">Standardize and improve AI interactions based on company policy.</p>
      </div>
    </header>

    <main class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      <section class="flex flex-col gap-6">
        
        <div class="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-sm">
          <label class="text-sm font-semibold text-slate-300 mb-2 flex justify-between">
            Company Rules / Context
            <span class="text-xs font-normal text-slate-500 bg-slate-800 px-2 py-0.5 rounded">Optional</span>
          </label>
          <textarea 
            v-model="companyContext"
            class="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all resize-none h-32"
            placeholder="Paste company values, tone of voice guidelines, or specific compliance rules here..."
          ></textarea>
        </div>

        <div class="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-sm flex-1 flex flex-col">
          <label class="block text-sm font-semibold text-slate-300 mb-2">
            Your Prompt
          </label>
          <textarea 
            v-model="originalPrompt"
            class="w-full bg-slate-950 border border-slate-700 rounded-lg p-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all resize-none flex-1 min-h-50"
            placeholder="Draft your prompt here... (e.g., 'Write an email to clients about the delay')"
          ></textarea>
          
          <div class="mt-5 flex flex-col sm:flex-row gap-3">
            <button 
              @click="handleAudit"
              :disabled="isLoading || !originalPrompt"
              class="flex-1 px-4 py-3 rounded-lg border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Search class="w-4 h-4" />
              Audit Prompt
            </button>
            
            <button 
              @click="handleOptimize"
              :disabled="isLoading || !originalPrompt"
              class="flex-2 px-4 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              <Wand2 class="w-4 h-4" />
              Optimize Prompt
            </button>
          </div>
        </div>
      </section>

      <section class="flex flex-col h-full min-h-125">
        
        <div v-if="isLoading" class="flex-1 bg-slate-900 rounded-xl border border-slate-800 p-8 flex flex-col items-center justify-center text-slate-400 animate-pulse">
          <Loader2 class="w-10 h-10 animate-spin text-emerald-500 mb-4" />
          <p class="text-sm font-medium">Processing your request...</p>
          <div class="w-3/4 h-2 bg-slate-800 rounded mt-6"></div>
          <div class="w-1/2 h-2 bg-slate-800 rounded mt-3"></div>
        </div>

        <div v-else-if="!hasResults" class="flex-1 bg-slate-900/50 border border-slate-800/50 rounded-xl border-dashed flex flex-col items-center justify-center text-slate-500 p-8">
          <div class="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <Wand2 class="w-8 h-8 opacity-20" />
          </div>
          <p>Ready to optimize. Enter your prompt on the left.</p>
        </div>

        <div v-else class="flex-1 bg-slate-900 rounded-xl border border-slate-800 shadow-sm overflow-hidden flex flex-col">
          
          <div class="flex border-b border-slate-800">
            <button 
              @click="activeTab = 'analysis'"
              :class="[
                'flex-1 py-4 text-sm font-medium transition-colors border-b-2',
                activeTab === 'analysis' 
                  ? 'text-amber-400 border-amber-400 bg-amber-400/5' 
                  : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/50'
              ]"
            >
              Analysis & Feedback
            </button>
            <button 
              @click="activeTab = 'optimized'"
              :class="[
                'flex-1 py-4 text-sm font-medium transition-colors border-b-2',
                activeTab === 'optimized' 
                  ? 'text-emerald-400 border-emerald-400 bg-emerald-400/5' 
                  : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/50'
              ]"
            >
              Optimized Result
            </button>
          </div>

          <div class="p-6 overflow-y-auto flex-1">
            
            <div v-if="activeTab === 'analysis'" class="space-y-4">
              <h3 class="text-slate-200 font-semibold flex items-center gap-2">
                <AlertCircle class="w-5 h-5 text-amber-500" />
                Suggested Improvements
              </h3>
              <ul class="space-y-3 mt-4">
                <li 
                  v-for="(item, index) in analysisResult" 
                  :key="index"
                  class="flex gap-3 text-slate-300 text-sm bg-slate-950/50 p-3 rounded border border-slate-800"
                >
                  <span class="text-amber-500 font-bold">•</span>
                  {{ item }}
                </li>
              </ul>
            </div>

            <div v-if="activeTab === 'optimized'">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-slate-200 font-semibold flex items-center gap-2">
                  <Check class="w-5 h-5 text-emerald-500" />
                  Final Prompt
                </h3>
                <button 
                  @click="copyToClipboard"
                  class="text-xs flex items-center gap-1 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  <component :is="showCopied ? Check : Copy" class="w-3.5 h-3.5" />
                  {{ showCopied ? 'Copied!' : 'Copy' }}
                </button>
              </div>
              
              <div class="bg-slate-950 rounded-lg border border-slate-700 p-4 font-mono text-sm text-emerald-50 leading-relaxed whitespace-pre-wrap">
                {{ optimizedResult || "No optimized version available. Try running 'Optimize Prompt'." }}
              </div>
            </div>

          </div>
        </div>

      </section>
    </main>
  </div>

</template>
<style scoped>
/* Custom scrollbar for the textarea and result areas */
textarea::-webkit-scrollbar, div::-webkit-scrollbar {
  width: 8px;
}
textarea::-webkit-scrollbar-track, div::-webkit-scrollbar-track {
  background: #0f172a; 
}
textarea::-webkit-scrollbar-thumb, div::-webkit-scrollbar-thumb {
  background: #334155; 
  border-radius: 4px;
}
textarea::-webkit-scrollbar-thumb:hover, div::-webkit-scrollbar-thumb:hover {
  background: #475569; 
}
</style>