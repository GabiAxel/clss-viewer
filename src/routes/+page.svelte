<script>

	import EcodTree from '$lib/EcodTree.svelte'
	import TsnePlot from '$lib/TsnePlot.svelte'
	import { WillowDark } from 'wx-svelte-core'
	import SelectedDomainsTable from '$lib/SelectedDomainsTable.svelte';
	import _ from 'lodash-es'

	let selectedDomains = $state([])
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

</script>

<WillowDark>
	<div class="h-screen flex flex-col">
		<div class="flex-1 flex flex-row overflow-hidden border-b-2 border-gray-500">
			<div class="flex-1 overflow-hidden">
				<EcodTree onzoomtoindice={zoomToDomains} onselectindice={selectIndice}/>
			</div>
			<div class="flex-1 overflow-hidden flex flex-col border-l-2 border-gray-500">
				<div class="border-b-2 border-gray-500 p-2">Click to select a domain or <strong>Shift</strong> + drag to select multiple domains. Mouse wheel to zoom in and out.</div>
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