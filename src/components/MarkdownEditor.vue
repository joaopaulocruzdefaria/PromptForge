<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  modelValue: string;
  placeholder?: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const content = ref(props.modelValue);
// Referência para o textarea que tem o scroll
const textareaRef = ref<HTMLTextAreaElement | null>(null);

// Expõe essa referência para o componente pai
defineExpose({
    scrollContainer: textareaRef
});

watch(() => props.modelValue, (newValue) => {
  if (newValue !== content.value) {
    content.value = newValue;
  }
});

const handleInput = (e: Event) => {
  const target = e.target as HTMLTextAreaElement;
  content.value = target.value;
  emit("update:modelValue", target.value);
};
</script>

<template>
  <div class="bg-white h-[75vh] w-full rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col relative group">
    <div class="bg-gray-50 border-b border-gray-200 px-4 py-2 shrink-0 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-red-400"></div>
        <div class="w-3 h-3 rounded-full bg-yellow-400"></div>
        <div class="w-3 h-3 rounded-full bg-green-400"></div>
        <span class="ml-4 text-xs font-mono text-gray-500">prompt.md</span>
      </div>
    </div>
    
    <textarea
      ref="textareaRef"
      :value="content"
      @input="handleInput"
      :placeholder="placeholder || 'Digite seu markdown aqui...'"
      class="w-full h-full flex-1 p-6 sm:p-8 font-mono text-sm text-gray-800 focus:outline-none resize-none bg-gray-50 overflow-y-auto leading-relaxed custom-scrollbar"
      spellcheck="false"
    />
  </div>
</template>