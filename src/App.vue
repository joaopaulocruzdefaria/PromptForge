<script setup>
import PromptEditor from './components/PromptEditor.vue'
import DualEditorView from './components/DualEditorView.vue'
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
import Logo from './components/Logo.vue'

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
<div id="App" class="bg-black">
    <Logo />
    <DualEditorView 
        :initial-content="promptContent"
        mode="split"
        @update:content="handleContentUpdate"
      />
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