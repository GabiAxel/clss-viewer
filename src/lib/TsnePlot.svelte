<script>
	import { map } from 'lodash-es'
	import { scaleLinear } from 'd3-scale'

	import { architectures, tsneData } from '$lib/data.js'
	import { onMount } from 'svelte'
	import download from 'downloadjs';

	let { selectedIndice, onSelectIndice, onLoaded } = $props()

	let canvasWrapper
	let canvasPoints
	let canvasLabels

	$effect(() => {
		if(selectedIndice && window.scatterplot) {
			window.scatterplot.select(selectedIndice, { preventEvent: true })
		}
	})

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
			const scatterplot = createScatterplot({
				canvas: canvasPoints,
				width: width,
				height: height,
				xScale: scaleLinear().domain([-1, 1]),
				yScale: scaleLinear().domain([-1, 1]),
				pointSize: 2,
				backgroundColor: '#111827',
				pointColor: map(architectures, 'color'),
				colorBy: 'valueA',
				opacity: [0.5, 1],
				opacityBy: 'valueB'
			})

			const points = tsneData.map(({ a_id, x, y }) => {
				return [x, y, parseInt(a_id) - 1, 0]
			})

			window.scatterplot = scatterplot

			scatterplot.draw(points).then(() => {
				onLoaded()
				if(selectedIndice.length > 0) {
						zoomToDomains(selectedIndice)
						scatterplot.select(selectedIndice, { preventEvent: true })
				}
			})

			scatterplot.subscribe('select', ({ points }) => onSelectIndice(points))

			const overlayFontSize = 20

			scatterplot.subscribe('drawing', ({ xScale, yScale }) => {

				const contextLabels = canvasLabels.getContext('2d')
				contextLabels.font = `${overlayFontSize * window.devicePixelRatio}px sans-serif`
				contextLabels.textAlign = 'center'

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
		window.scatterplot.set({ width, height })
		resizeLabelsCanvas()
	}

	export const zoomToDomains = indice =>
		window.scatterplot.zoomToPoints(indice, { transition: true })

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