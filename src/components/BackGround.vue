<template>
	<canvas id="live2d-canvas" />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { loadLive2D } from '@/assets/ts/live2d';

onMounted(async () => {
	await loadLive2D('live2d-canvas', '@/assets/models/ARGNori/ARGNori.model3.json');
});
</script>
