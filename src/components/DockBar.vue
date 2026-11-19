<template>
	<div class="dock-container">
		<div class="dock-shell" @mousemove="handleMouseMove" @mouseleave="resetAllScale">
			<div v-for="(icon, index) in dockIconList" :key="index" class="dock-icon"
				:class="{ 'is-bouncing': bouncingIndex === index }" @click.stop.prevent="handleOpenApp(index)">
				<img :src="icon.icon" />
			</div>
		</div>
	</div>
</template>

<style scoped>
.dock-container {
	position: absolute;
	bottom: 5%;
	inset-inline: 0;
	display: flex;
	justify-content: center;
	overflow: visible;
}

.dock-shell {
	background: rgba(50, 50, 50, 0.65);
	backdrop-filter: blur(12px);
	border-radius: 12px;
	display: flex;
	gap: 8px;
	padding: 8px 12px;
	overflow: visible;
}

.dock-icon {
	width: 48px;
	height: 48px;
	object-fit: contain;
	transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
	overflow: visible;
	transform-origin: bottom;
	cursor: pointer;
	--current-scale: 1;
	transform: scale(var(--current-scale));
	will-change: transform;
}

.dock-icon>img,
svg {
	width: 48px;
	height: 48px;
	user-select: none;
	-webkit-user-drag: none;
}

/* 优化后丝滑弹跳动画 */
@keyframes macLaunchBounce {
	0% {
		/* 初始状态 */
		transform: scale(var(--current-scale)) translateY(0);
	}

	20% {
		/* 蓄力阶段：轻微下压，稍微缩小 */
		transform: scale(calc(var(--current-scale) * 0.95)) translateY(2px);
	}

	45% {
		/* 爆发阶段：快速向上弹起，显著放大 */
		transform: scale(calc(var(--current-scale) * 1.15)) translateY(-8px);
	}

	70% {
		/* 回落阶段：轻微过冲回弹 */
		transform: scale(calc(var(--current-scale) * 1.02)) translateY(1px);
	}

	85% {
		/* 二次微调：极小的反向修正 */
		transform: scale(calc(var(--current-scale) * 0.99)) translateY(-1px);
	}

	100% {
		/* 稳定状态 */
		transform: scale(var(--current-scale)) translateY(0);
	}
}

.dock-icon.is-bouncing {
	animation: macLaunchBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import { load_pic } from '@/assets/ts/func'
const vueIcon = load_pic('@/assets/img/vueIcon.dataurl')
const githubIcon = load_pic('@/assets/img/github.svg')
const wordIcon = load_pic('@/assets/img/apps/microsoft/word.svg')
const excelIcon = load_pic('@/assets/img/apps/microsoft/excel.svg')
const powerpointIcon = load_pic('@/assets/img/apps/microsoft/powerpoint.svg')
const outlookIcon = load_pic('@/assets/img/apps/microsoft/outlook.svg')

const dockIconList = ref([
	{
		scale: 1,
		icon: vueIcon,
	},
	{
		scale: 1,
		icon: githubIcon,
	},
	{
		scale: 1,
		icon: wordIcon,
	},
	{
		scale: 1,
		icon: excelIcon,
	},
	{
		scale: 1,
		icon: powerpointIcon,
	},
	{
		scale: 1,
		icon: outlookIcon,
	},
])
const bouncingIndex = ref<number | null>(null)
// 新增动画锁，防止重复点击触发冲突
const isAnimating = ref(false)

const handleMouseMove = (e: MouseEvent) => {
	const dockIcons = document.querySelectorAll('.dock-icon')
	dockIcons.forEach((icon, idx) => {
		const rect = icon.getBoundingClientRect()
		const iconCenterX = rect.left + rect.width / 2
		const distance = Math.abs(e.clientX - iconCenterX)
		const maxDistance = 120
		const newScale = Math.max(1, 1.6 - (distance / maxDistance) * 0.7)
		dockIconList.value[idx]!.scale = newScale
			; (icon as HTMLElement).style.setProperty('--current-scale', String(newScale))
	})
}

const resetAllScale = () => {
	dockIconList.value.forEach((icon, idx) => {
		icon.scale = 1
		const iconDom = document.querySelectorAll('.dock-icon')[idx] as HTMLElement
		iconDom.style.setProperty('--current-scale', '1')
	})
}

const handleOpenApp = (index: number) => {
	// 动画执行中直接拦截重复点击
	if (isAnimating.value) return
	isAnimating.value = true
	bouncingIndex.value = index
	setTimeout(() => {
		bouncingIndex.value = null
		isAnimating.value = false
	}, 600)
	console.log('打开第', index + 1, '个应用')
}
</script>
