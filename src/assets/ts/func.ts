const imagesAsUrl = import.meta.glob('@/assets/img/**/*', {
	query: '?url',
	import: 'default',
	eager: true,
})

const imagesAsRaw = import.meta.glob('@/assets/img/**/*', {
	query: '?raw',
	import: 'default',
	eager: true,
})

const globPrefix = (() => {
	const key = Object.keys(imagesAsRaw)[0]
	if (!key) return '/src/assets/img/'
	const parts = key.split('/')
	const imgIdx = parts.indexOf('img')
	const validParts = imgIdx !== -1 ? parts.slice(0, imgIdx + 1) : parts.slice(0, -1)
	const path = validParts.filter((p) => p).join('/') // filter 去除空字符串
	return key.startsWith('@') ? `@/${path}/` : `/${path}/`
})()

/**
 * 将任意输入路径标准化为 glob 能识别的 Key
 * @param inputPath 用户传入的路径，如 './github.svg', '@/assets/img/github.svg', 'apps/microsoft/word.svg'
 */
function normalizePicPath(inputPath: string): string {
	if (!inputPath) return ''

	// 如果已经以 globPrefix 开头，直接返回
	if (inputPath.startsWith(globPrefix)) {
		return inputPath
	}

	// 标准化分隔符
	const normalizedInput = inputPath.replace(/\\/g, '/')

	// 提取相对于 'img' 目录的路径部分
	let relativePath = ''
	const imgIndex = normalizedInput.indexOf('/img/')

	if (imgIndex !== -1) {
		// 情况 A: 路径中包含 /img/，截取 '/img/' 之后的所有内容
		relativePath = normalizedInput.slice(imgIndex + '/img/'.length)
	} else {
		// 情况 B: 路径中不包含 /img/，例如 'github.svg' 或 './icons/logo.png'，只取文件名
		const parts = normalizedInput.split('/')
		relativePath = parts.pop() || ''
	}

	if (!relativePath) {
		console.error('无效的图片路径或无法提取相对路径:', inputPath)
		return ''
	}

	// 拼接成标准的 Glob Key
	return `${globPrefix}${relativePath}`
}

/**
 * 加载图片
 * @param picDir 图片路径，例如 '@/assets/img/logo.png' 或 '@/assets/img/data.dataurl'
 */
export function load_pic(picDir: string) {
	picDir = normalizePicPath(picDir)
	// 根据后缀判断使用哪个 glob
	if (picDir.endsWith('.dataurl')) {
		return imagesAsRaw[picDir]
	} else {
		return imagesAsUrl[picDir]
	}
}
