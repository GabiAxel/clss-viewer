<script>
	import { Button, TextArea } from 'wx-svelte-core'
	import { sourceIndices } from '$lib/data.js'
	import _, { uniq, isSafeInteger } from 'lodash-es'
	import { tick } from 'svelte'

	const TEXTAREA_ID = 'bulk-select-textarea'

	let { show, selectIndices, onClose } = $props()

	let value = ''
	let ids = $state([])

	$effect(() => {
		if(show) {
			tick().then(() => {
				const textarea = window.document.getElementById(TEXTAREA_ID)
				textarea.value = ''
				textarea.focus()
				ids = []
			})
		}
	})

	function onTextChange() {
		ids = uniq(value.toUpperCase().split(/[^a-zA-Z0-9]+/).filter(i => !!i))
	}

	function findDomainsAndSelect() {
		const indices = _(ids).flatMap(sourceId => sourceIndices[sourceId]).filter(isSafeInteger).value()
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
			<TextArea bind:value onchange={onTextChange} id={TEXTAREA_ID} placeholder="Example: P05067, 5BUO"/>
		</div>
		<div class="flex align-middle">
			<p class="grow">
				{#if ids.length === 1}
					One identifier
				{:else if ids.length > 1}
					{ids.length} identifiers
				{/if}
			</p>
			<Button onclick={findDomainsAndSelect} disabled={ids.length === 0} type="primary">Select Domains</Button>
			<Button onclick={onClose}>Cancel</Button>
		</div>
	</div>
</div>