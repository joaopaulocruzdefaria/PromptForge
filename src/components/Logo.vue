<script setup lang="ts">
// 1. Importe a imagem como se fosse um componente
import logoImg from '../assets/Logo.png' 
</script>

<template>
<div class="logo">
    <img :src="logoImg" alt="Logo PromptForge" />
</div>
</template>

<style scoped>
.logo {
    padding-top: 50px;
    padding-left: 45px;
}

.logo img {
    width: 45%; 
    max-width: 500px; 
    height: auto;
    display: block; /* Remove espaços fantasmas abaixo da imagem */
}
</style>