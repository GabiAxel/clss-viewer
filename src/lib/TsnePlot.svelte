<script>
	import { map } from 'lodash-es'
	import { scaleLinear } from 'd3-scale'

	import { architectures, tsneData } from '$lib/data.js'
	import { onMount } from 'svelte'
	import download from 'downloadjs';

	let { onselect } = $props()

	let canvasWrapper
	let canvasPoints
	let canvasLabels

	let scatterplot

	const resizeLabelsCanvas = () => {
		const { width, height } = canvasWrapper.getBoundingClientRect()
		canvasLabels.width = width * window.devicePixelRatio
		canvasLabels.height = height * window.devicePixelRatio
		canvasLabels.style.width = `${width}px`
		canvasLabels.style.height = `${height}px`
	}

	onMount(() => {

		resizeLabelsCanvas()

		const { width, height } = canvasPoints.getBoundingClientRect()
		import('regl-scatterplot').then(({ default: createScatterplot }) => {
			scatterplot = createScatterplot({
				canvas: canvasPoints,
				width: width,
				height: height,
				xScale: scaleLinear().domain([-1, 1]),
				yScale: scaleLinear().domain([-1, 1]),
				pointSize: 2,
				backgroundColor: '#111827',
				pointColor: map(architectures, 'color'),
				colorBy: 'valueA',
				opacity: [0.1, 1],
				opacityBy: 'valueB'
			})

			const points = tsneData.map(({ a_id, x, y }) => {
				return [x, y, parseInt(a_id) - 1, 0]
			})

			scatterplot.draw(points).then(() => {
				try {
					const initialIndice = window.location.hash.substring(2).split(',').map(i => parseInt(i)).filter(i => !isNaN(i))
					if(initialIndice.length > 0) {
						zoomToDomains(initialIndice)
						selectIndice(initialIndice)
					}
				} catch(e) {
					console.error(e)
					window.history.replaceState(undefined, '', '#/')
				}
			})

			scatterplot.subscribe('select', ({ points }) => {
				const selected = points.map(i => tsneData[i])
				onselect(selected, points)
			})

			const overlayFontSize = 12
			const contextLabels = canvasLabels.getContext('2d')
			contextLabels.font = `${overlayFontSize * window.devicePixelRatio}px sans-serif`
			contextLabels.textAlign = 'center'

			scatterplot.subscribe('drawing', ({ xScale, yScale }) => {
				contextLabels.clearRect(0, 0, canvasLabels.width, canvasLabels.height)

				const pointsInView = scatterplot.get('pointsInView')
				if(pointsInView.length <= 100) {
					contextLabels.fillStyle = 'rgb(255, 255, 255)'
					const dpr = window.devicePixelRatio
					for(let i = 0; i < pointsInView.length; i++) {
						const [x, y] = points[pointsInView[i]]
						const { ecod_id } = tsneData[pointsInView[i]]
						contextLabels.fillText(ecod_id, xScale(x) * dpr, yScale(y) * dpr - overlayFontSize * 1.2 * dpr)
					}
				}
			})

		})

		window.addEventListener('resize', () => redrawCanvas())
	})

	export const redrawCanvas = () => {
		const { width, height } = canvasWrapper.getBoundingClientRect()
		scatterplot.set({ width, height })
		resizeLabelsCanvas()
	}

	export const zoomToDomains = indice =>
		scatterplot.zoomToPoints(indice, { transition: true })

	export const selectIndice = indice =>
		scatterplot.select(indice)

	export const exportImage = () => {
		canvasPoints.toBlob(blob => download(blob, 'CLSS_tSNE.png', 'image/png'), 'image/png')
	}

</script>

<div bind:this={canvasWrapper} class="w-full h-full relative">
	<canvas bind:this={canvasPoints} class="absolute top-0 bottom-0 left-0 right-0"></canvas>
	<canvas bind:this={canvasLabels} class="absolute top-0 bottom-0 left-0 right-0 pointer-events-none"></canvas>
</div>

<style>
	canvas {
			width: 100%;
			height: 100%;
	}
</style>