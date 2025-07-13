<script>

	import EcodTree from '$lib/EcodTree.svelte'
	import TsnePlot from '$lib/TsnePlot.svelte'
	import { WillowDark } from 'wx-svelte-core'
	import SelectedDomainsTable from '$lib/SelectedDomainsTable.svelte';

	let selectedDomains = $state([])
	let tsnePlot

	const zoomToDomains = indice =>
		tsnePlot.zoomToDomains(indice)

	const showSelectedDomains = selected =>
		selectedDomains = selected

</script>

<WillowDark>
	<div class="h-screen flex flex-col">
		<div class="flex-1 flex flex-row overflow-hidden">
			<div class="flex-1 overflow-hidden">
				<EcodTree onselect={zoomToDomains}/>
			</div>
			<div class="flex-1 overflow-hidden flex flex-col">
				<div>Click to select a domain or Shift + drag to select multiple domains</div>
				<div class="flex-1">
					<TsnePlot bind:this={tsnePlot} onselect={showSelectedDomains}/>
				</div>
			</div>
		</div>
		<div class="flex-1 overflow-hidden">
			<SelectedDomainsTable selected={selectedDomains}/>
		</div>
	</div>
</WillowDark>