<script>
	import EcodTree from '$lib/EcodTree.svelte'
	import TsnePlot from '$lib/TsnePlot.svelte'
	import { Button, WillowDark } from 'wx-svelte-core'
	import SelectedDomainsTable from '$lib/SelectedDomainsTable.svelte'
	import _, { uniq } from 'lodash-es'
	import { onMount, tick } from 'svelte'

	const RADIX = 36

	let expandedTsne = $state(false)
	let selectedIndice = $state([])
	let treeLoaded = $state(false)
	let plotLoaded = $state(false)
	let tsnePlot

	onMount(() => {
		try {
			selectedIndice = window.location.hash.substring(2).split(',').map(i => parseInt(i, RADIX)).filter(i => !isNaN(i))
		} catch(e) {
			console.error(e)
			window.history.replaceState(undefined, '', '#/')
		}
	})

	const zoomToDomains = indice =>
		tsnePlot.zoomToDomains(indice)

	const setSelectedIndice = indice => {
		selectedIndice = indice
		window.history.replaceState(undefined, '', '#/' + _(selectedIndice).map(i => i.toString(RADIX)).sortBy().join(','))
	}

	const appendSelectedIndice = indice => setSelectedIndice(uniq([...selectedIndice, ...indice]))

	const toggleExpandedTsne = () => {
		expandedTsne = !expandedTsne
		tick().then(() => tsnePlot.redrawCanvas())
	}

</script>

<WillowDark>
	{#if !(treeLoaded && plotLoaded)}
		<div class="absolute z-10 top-10 bottom-0 left-0 right-0 bg-neutral-800 flex items-center justify-center text-2xl">
			<p class="animate-pulse">Loading...</p>
		</div>
	{/if}
	<div class="h-screen flex flex-col">
		<div class="flex flex-row items-center bg-gray-600 text-neutral-200 px-4 py-1 text-lg">
			<h1 class="flex-1">Contrastive Learning Sequence-Structure (CLSS) - ECOD Domain Space Viewer</h1>
			<a href="https://github.com/GabiAxel/clss-viewer" target="_blank" aria-label="GitHub"><i class="mdi mdi-github"></i></a>
		</div>
		<div class="flex-1 flex flex-row overflow-hidden border-b-2 border-gray-500">
			<div class="flex-1 overflow-hidden">
				<EcodTree onzoomtoindice={zoomToDomains} onselectindice={appendSelectedIndice} onLoaded={() => treeLoaded = true}/>
			</div>
			<div class={(expandedTsne ? 'fixed inset-0 z-10' : 'border-l-2 border-gray-500') + ' flex-1 overflow-hidden flex flex-col bg-neutral-800'}>
				<div class="flex flex-row border-b-1 border-gray-700 p-1">
					<div class="flex-1 flex items-center">Click to select a domain or Shift + drag to select multiple domains. Mouse wheel to zoom in and out.</div>
					<div>
						<Button icon="mdi mdi-camera" title="Save image" onclick={() => tsnePlot.exportImage()}/>
						<Button icon={expandedTsne ? 'mdi mdi-arrow-collapse' : 'mdi mdi-arrow-expand'} title={expandedTsne ? 'Collapse' : 'Expand'} onclick={toggleExpandedTsne}/>
					</div>
				</div>
				<div class="flex-1">
					<TsnePlot bind:this={tsnePlot} selectedIndice={selectedIndice} onSelectIndice={setSelectedIndice} onLoaded={() => plotLoaded = true}/>
				</div>
			</div>
		</div>
		<div class="flex-1 overflow-hidden">
			<SelectedDomainsTable selectedIndice={selectedIndice} onSelectIndice={setSelectedIndice}/>
		</div>
	</div>
</WillowDark>