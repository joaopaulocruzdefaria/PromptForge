<script setup>
import { SearchCode } from "lucide-vue-next";
const emit = defineEmits(["audit"]);
</script>

<template>
    <button
        @click="emit('click')"
        class="group fixed bottom-8 right-8 z-50 flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-br from-purple-600 to-fuchsia-500 text-white shadow-lg shadow-purple-500/40 border border-white/10 transition-all duration-300 ease-out hover:scale-110 hover:-translate-y-1 hover:shadow-purple-500/60 active:scale-95 active:shadow-purple-500/20"
    >
        <SearchCode stroke-width="2.5" class="w-7 h-7" />

        <span
            class="absolute right-[110%] top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-900 border border-purple-500/30 text-gray-200 text-sm font-medium rounded-lg shadow-xl shadow-black/50 whitespace-nowrap opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 pointer-events-none"
        >
            Realizar Auditoria

            <span
                class="absolute top-1/2 -right-1 -translate-y-1/2 border-4 border-transparent border-l-gray-900"
            ></span>
        </span>
    </button>
</template>
