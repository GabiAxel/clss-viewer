<script>
	import EcodTree from '$lib/EcodTree.svelte'
	import TsnePlot from '$lib/TsnePlot.svelte'
	import { Button, WillowDark } from 'wx-svelte-core'
	import SelectedDomainsTable from '$lib/SelectedDomainsTable.svelte'
	import _, { uniq } from 'lodash-es'
	import { onMount, tick } from 'svelte'

	const RADIX = 36

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
			<TsnePlot bind:this={tsnePlot} selectedIndice={selectedIndice} onSelectIndice={setSelectedIndice} onLoaded={() => plotLoaded = true}/>
		</div>
		<div class="basis-1/3 overflow-hidden">
			<SelectedDomainsTable selectedIndice={selectedIndice} onSelectIndice={setSelectedIndice}/>
		</div>
	</div>
</WillowDark>