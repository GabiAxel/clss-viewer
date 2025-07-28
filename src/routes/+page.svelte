<script>

	import EcodTree from '$lib/EcodTree.svelte'
	import TsnePlot from '$lib/TsnePlot.svelte'
	import { Button, WillowDark } from 'wx-svelte-core';
	import SelectedDomainsTable from '$lib/SelectedDomainsTable.svelte';
	import _ from 'lodash-es'
	import { tick } from 'svelte';

	let selectedDomains = $state([])
	let expandedTsne = $state(false)
	let tsnePlot

	const zoomToDomains = indice =>
		tsnePlot.zoomToDomains(indice)

	const selectIndice = indice =>
		tsnePlot.selectIndice(indice)

	const showSelectedDomains = (selected, indice) => {
		selectedDomains = selected
		window.history.replaceState(undefined, '', '#/' + _(indice).sortBy(i => parseInt(i)).join(','))
	}

	const onclear = () => {
		selectIndice([])
		showSelectedDomains([], [])
	}

	const toggleExpandedTsne = () => {
		expandedTsne = !expandedTsne
		tick().then(() => tsnePlot.redrawCanvas())
	}

</script>

<WillowDark>
	<div class="h-screen flex flex-col">
		<div class="flex-1 flex flex-row overflow-hidden border-b-2 border-gray-500">
			<div class="flex-1 overflow-hidden">
				<EcodTree onzoomtoindice={zoomToDomains} onselectindice={selectIndice}/>
			</div>
			<div class={(expandedTsne ? 'fixed inset-0 z-10' : 'border-l-2 border-gray-500') + ' flex-1 overflow-hidden flex flex-col bg-neutral-800'}>
				<div class="flex flex-row border-b-2 border-gray-500 p-1">
					<div class="flex-1 flex items-center">Click to select a domain or Shift + drag to select multiple domains. Mouse wheel to zoom in and out.</div>
					<div>
						<Button icon="wxi-camera" title="Save image" onclick={() => tsnePlot.exportImage()}/>
						<Button icon={expandedTsne ? 'wxi-collapse' : 'wxi-expand'} title={expandedTsne ? 'Collapse' : 'Expand'} onclick={toggleExpandedTsne}/>
					</div>
				</div>
				<div class="flex-1">
					<TsnePlot bind:this={tsnePlot} onselect={showSelectedDomains}/>
				</div>
			</div>
		</div>
		<div class="flex-1 overflow-hidden">
			<SelectedDomainsTable selected={selectedDomains} onclear={onclear}/>
		</div>
	</div>
</WillowDark>