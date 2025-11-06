<script>
	import { Button, TextArea } from 'wx-svelte-core'
	import { ecodIndex } from '$lib/data.js'
	import _ from 'lodash-es'

	const { show, selectIndices, onClose } = $props()

	let value = ''

	function findDomainsAndSelect() {
		const indices = new Set()
		console.log(value)
		console.log(value.toUpperCase().split(/[^A-Z0-9]+/))
		value.toUpperCase().split(/[^A-Z0-9]+/).forEach(item => {
			if(item.length === 4) {
				_(ecodIndex).toPairs().filter(i => i[0].startsWith(`e${item}`)).map(x => {console.log(x); return x[1]}).forEach(i => indices.add(i))
			}
		})

		selectIndices(indices)
		onClose()
	}
</script>

<svelte:window on:keydown={event => {if(event.key === 'Escape') onClose()}}/>
<div class={`fixed z-50 inset-0 flex items-center justify-center ${show ? 'block' : 'hidden'}`}`>
	<div class="absolute inset-0 bg-gray-500 opacity-50" onclick={onClose}></div>
	<div class="relative bg-white dark:bg-gray-900 shadow-lg p-4 max-w-xl">
		<p>Enter a list of PDB identifiers and/or UniProt primary accessions to select and highlight their corresponding ECOD domains.</p>
		<div class="my-4">
			<TextArea bind:value placeholder="Example: P05067, 5BUO"/>
		</div>
		<div class="flex justify-end">
			<Button onClick={findDomainsAndSelect} type="primary">Select Domains</Button>
			<Button onclick={onClose}>Cancel</Button>
		</div>
	</div>
</div>