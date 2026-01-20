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
  const textareaRef = ref<HTMLTextAreaElement | null>(null);

  defineExpose({
    scrollContainer: textareaRef,
  });

  watch(
    () => props.modelValue,
    (newValue) => {
      if (newValue !== content.value) {
        content.value = newValue;
      }
    }
  );

  const handleInput = (e: Event) => {
    const target = e.target as HTMLTextAreaElement;
    content.value = target.value;
    emit("update:modelValue", target.value);
  };
</script>

<template>
  <div
    class="bg-zinc-900 h-[75vh] w-full rounded-xl shadow-2xl shadow-black/50 border border-zinc-800 overflow-hidden flex flex-col relative group transition-colors duration-300 hover:border-zinc-700"
  >
    <div
      class="bg-zinc-800/50 border-b border-zinc-800 px-4 py-2 shrink-0 flex items-center justify-between backdrop-blur-sm h-12"
    >
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
        <div class="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
        <div class="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>

        <span
          class="ml-4 text-xs font-mono text-fuchsia-400 font-medium tracking-wide drop-shadow-sm"
          >prompt.md</span
        >
      </div>
    </div>

    <textarea
      ref="textareaRef"
      :value="content"
      @input="handleInput"
      :placeholder="placeholder || 'Digite seu markdown aqui...'"
      class="w-full h-full flex-1 p-6 sm:p-8 font-mono text-sm text-gray-300 placeholder-zinc-600 focus:outline-none resize-none bg-transparent overflow-y-auto leading-relaxed custom-scrollbar caret-fuchsia-500 selection:bg-fuchsia-500/20 selection:text-fuchsia-100"
      spellcheck="false"
    />
  </div>
</template>

<style scoped>
  .custom-scrollbar::-webkit-scrollbar {
    width: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #3f3f46;
    border-radius: 5px;
    border: 2px solid #18181b;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #52525b;
  }
</style>
