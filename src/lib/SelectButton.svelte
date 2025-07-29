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

<button onclick={onClick} title="Select domain(s)" aria-label="Select domain(s)"><i class="mdi mdi-check-circle"></i></button>