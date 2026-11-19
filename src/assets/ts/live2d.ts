import { Application, Ticker } from 'pixi.js'
import { Live2DModel } from '@naari3/pixi-live2d-display'

declare global {
	interface Window {
		Live2DCubismCore?: {
			CubismVersion: string
		}
	}
}

async function loadCubismCore(): Promise<void> {
	if (window.Live2DCubismCore) return
	return new Promise((resolve, reject) => {
		const script = document.createElement('script')
		script.src = '/src/public/live2dcubismcore.min.js'
		script.onload = () => resolve()
		script.onerror = reject
		document.head.appendChild(script)
	})
}

export async function loadLive2D(canvasId: string, modelJson: string) {
	await loadCubismCore()

	const el = document.getElementById(canvasId)
	if (!el || !(el instanceof HTMLCanvasElement)) {
		throw new Error(`Canvas not found: ${canvasId}`)
	}

	const app = new Application()
	await app.init({
		canvas: el,
		resizeTo: el,
	})

	// 通过选项传入 ticker，弃用 registerTicker
	const mdl = await Live2DModel.from(modelJson, {
		ticker: Ticker.shared,
	})

	mdl.scale.set(0.3)
	mdl.x = 200
	mdl.y = 300
	mdl.eventMode = 'static' // Pixi v8 开启点击交互

	mdl.on('pointerdown', () => {
		void mdl.motion('Idle')
	})

	app.stage.addChild(mdl)
	return { app, mdl }
}
