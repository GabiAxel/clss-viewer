<script>
	import EcodTree from '$lib/EcodTree.svelte'
	import TsnePlot from '$lib/TsnePlot.svelte'
	import InfoModal from '$lib/InfoModal.svelte'
	import { Willow, WillowDark } from 'wx-svelte-core'
	import SelectedDomainsTable from '$lib/SelectedDomainsTable.svelte'
	import _, { difference, uniq } from 'lodash-es'
	import { onMount } from 'svelte'
	import BulkSelectModal from '$lib/BulkSelectModal.svelte'

	const RADIX = 36

	let selectedIndices = $state([])
	let treeLoaded = $state(false)
	let plotLoaded = $state(false)
	let showInfoModal = $state(false)
	let showBulkModal = $state(false)

	let darkMode = $state(typeof window !== 'undefined' && (window.localStorage.theme === 'dark' || (!('theme' in window.localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)))

	// let visibleIndices = []
	let tsnePlot

	$effect(() => applyTheme(darkMode))

	let ThemeComponent = $derived(darkMode ? WillowDark : Willow)

	const applyTheme = darkMode => {
		document.documentElement.style.colorScheme = darkMode ? 'dark' : 'light'
		document.documentElement.className = darkMode ? 'dark' : ''
		localStorage.setItem('theme', darkMode ? 'dark' : 'light')
	}

	onMount(() => {
		applyTheme(darkMode)
		try {
			selectedIndices = window.location.hash.substring(2).split(',').map(i => parseInt(i, RADIX)).filter(i => !isNaN(i))
		} catch(e) {
			console.error(e)
			window.history.replaceState(undefined, '', '#/')
		}
	})

	const appendToVisibleIndices = indices => {
		// console.log('A')
		// // visibleIndices = visibleIndices.union(new Set(indices))
		// visibleIndices = visibleIndices + indices
		// console.log('B', visibleIndices.length)
		// // tsnePlot.filter(Array.from(visibleIndices))
		tsnePlot.appendToVisibleIndices(indices)
		// console.log('C')
	}

	const setOnlyVisibleIndices = indices => {
		// visibleIndices = new Set(indices)
		tsnePlot.setOnlyVisibleIndices(indices)
	}

	const zoomToDomains = indices => tsnePlot.zoomToDomains(indices)

	const setSelectedIndices = indices => {
		selectedIndices = indices
		window.history.replaceState(undefined, '', '#/' + _(selectedIndices).map(i => i.toString(RADIX)).sortBy().join(','))
	}

	const appendSelectedIndices = indices => setSelectedIndices(uniq([...selectedIndices, ...indices]))

	const removeIndicesFromSelection = indicesToRemove => setSelectedIndices(difference(selectedIndices, indicesToRemove))

	const openEcodPage = ecodId => window.open(`http://prodata.swmed.edu/ecod/af2_pdb/domain/${ecodId}`, '_blank')

</script>

<ThemeComponent/>
<div class={darkMode ? 'wx-willow-dark-theme' : 'wx-willow-theme'}>
	{#if !(treeLoaded && plotLoaded)}
		<div class="absolute z-10 top-10 bottom-0 left-0 right-0 bg-neutral-800 flex items-center justify-center text-2xl">
			<p class="animate-pulse">Loading...</p>
		</div>
	{/if}
	<InfoModal show={showInfoModal} onClose={() => showInfoModal = false}/>
	<BulkSelectModal show={showBulkModal} onClose={() => showBulkModal = false} selectIndices={appendSelectedIndices}/>
	<div class="h-screen flex flex-col">
		<div class="flex flex-row items-center bg-gray-600 text-neutral-200 px-4 py-1 text-lg">
			<h1 class="flex-1">Contrastive Learning Sequence-Structure (CLSS) - ECOD Domain Space Viewer</h1>
			<button onclick={() => darkMode = !darkMode} aria-label="Theme" class="mx-4"><i class={`mdi mdi-${darkMode ? 'white-balance-sunny' : 'moon-waxing-crescent'}`}></i></button>
			<button onclick={() => showInfoModal = true} aria-label="Theme"><i class="mdi mdi-help-circle-outline"></i></button>
		</div>
		<div class="flex-1 flex flex-row overflow-hidden border-b-2 border-gray-500">
			<div class="flex-1 overflow-hidden">
				<EcodTree
					onZoomToIndices={zoomToDomains}
					onSelectIndices={appendSelectedIndices}
					onDeselectIndices={removeIndicesFromSelection}
					onAppendVisibleIndices={appendToVisibleIndices}
					onSetOnlyVisibleIndices={setOnlyVisibleIndices}
					onLoaded={() => treeLoaded = true}
				/>
			</div>
			<TsnePlot
				bind:this={tsnePlot}
				selectedIndices={selectedIndices}
				onSelectIndices={setSelectedIndices}
				openEcodPage={openEcodPage}
				onLoaded={() => plotLoaded = true}
				openBulkModal={() => showBulkModal = true}
			/>
		</div>
		<div class="basis-1/3 overflow-hidden">
			<SelectedDomainsTable selectedIndices={selectedIndices} onSelectIndices={setSelectedIndices} onZoomToIndices={zoomToDomains} openEcodPage={openEcodPage}/>
		</div>
	</div>
</div>