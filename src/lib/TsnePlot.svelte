<script>
	import { map } from 'lodash-es'
	import { scaleLinear } from 'd3-scale'

	import { architectures, tsneData } from '$lib/data.js'
	import { onMount, tick } from 'svelte'
	import download from 'downloadjs';
	import { Button } from 'wx-svelte-core'

	let { selectedIndice, onSelectIndice, onLoaded, openEcodPage } = $props()
	let expandedTsne = $state(false)
	let hoverDomainHTML = $state('')

	let canvasWrapper
	let canvasPoints
	let hoverDomainId = null

	$effect(() => {
		if(selectedIndice && window.scatterplot) {
			window.scatterplot.select(selectedIndice, { preventEvent: true })
		}
	})

	onMount(() => {

		const { width, height } = canvasPoints.getBoundingClientRect()
		import('regl-scatterplot').then(({ default: createScatterplot }) => {
			const scatterplot = createScatterplot({
				canvas: canvasPoints,
				width: width,
				height: height,
				xScale: scaleLinear().domain([-1, 1]),
				yScale: scaleLinear().domain([-1, 1]),
				pointSize: 1,
				pointColor: map(architectures, 'color'),
				colorBy: 'valueA',
				opacity: [0.4, 1],
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

			scatterplot.subscribe('pointOver', i => {
				const d = tsneData[i]
				hoverDomainId = d.ecod_id
				hoverDomainHTML = `<strong>${d.ecod_id}</strong> / ${d.f_id}<br/>${d.a_name}<br/>${d.x_name}<br/>${d.h_name}<br/>${d.t_name}<br/>${d.f_name || 'No F-group'}`
			})

			scatterplot.subscribe('pointOut', () => {
				hoverDomainId = null
				hoverDomainHTML = ''
			})

		})

		window.addEventListener('resize', () => redrawCanvas())
	})

	export const redrawCanvas = () => {
		const { width, height } = canvasWrapper.getBoundingClientRect()
		window.scatterplot.set({ width, height })
	}

	export const zoomToDomains = indice =>
		window.scatterplot.zoomToPoints(indice, { transition: true })

	const exportImage = () => {
		canvasPoints.toBlob(blob => download(blob, 'CLSS_tSNE.png', 'image/png'), 'image/png')
	}

	const toggleExpandedTsne = () => {
		expandedTsne = !expandedTsne
		tick().then(() => redrawCanvas())
	}

	const onCanvasContextMenu = e => {
		e.preventDefault()
		if(hoverDomainId) {
			openEcodPage(hoverDomainId)
		}
	}

</script>

<div class={`${expandedTsne ? 'fixed inset-0 z-10' : 'border-l-2 border-gray-500'} flex-1 overflow-hidden flex flex-col not-dark:bg-white`}>
	<div class="flex flex-row">
		<div class="flex-1 flex items-center pl-2 not-dark:bg-gray-50">Click to select a domain or Shift + drag to select multiple domains. Mouse wheel to zoom in and out. Right-click to open ECOD domain page.</div>
		<div>
			<Button icon="mdi mdi-camera" title="Save image" onclick={() => exportImage()}/>
			<Button icon={expandedTsne ? 'mdi mdi-arrow-collapse' : 'mdi mdi-arrow-expand'} title={expandedTsne ? 'Collapse' : 'Expand'} onclick={toggleExpandedTsne}/>
		</div>
	</div>
	<div bind:this={canvasWrapper} class="flex-1 relative border-y-1 border-gray-700 p-1 not-dark:bg-white dark:bg-black">
		<canvas bind:this={canvasPoints} oncontextmenu={onCanvasContextMenu} class="absolute top-0 bottom-0 left-0 right-0"></canvas>
	</div>
	<div class="h-32 px-2 py-1 not-dark:bg-gray-50">{@html hoverDomainHTML}</div>
</div>


<style>
	canvas {
			width: 100%;
			height: 100%;
	}
</style>