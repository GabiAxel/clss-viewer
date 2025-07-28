<script>
	import { Button } from 'wx-svelte-core'
	import { getPointIndiceInEcodHierarchy } from '$lib/data.js';
	let { row, onaction } = $props()

	function onClick() {
		onaction({
			action: 'selectindice',
			data: getPointIndiceInEcodHierarchy(row.id)
		})
	}
</script>

<Button onclick={onClick} icon="wxi-check" title="Select domain(s)"/>