<script>
	import { Button } from 'wx-svelte-core'
	import { getPointIndiceInEcodHierarchy } from '$lib/data.js';
	let { row, onaction } = $props()

	function onClick() {
		onaction({
			action: 'zoomtoindice',
			data: getPointIndiceInEcodHierarchy(row.id)
		})
	}
</script>

<Button onclick={onClick} icon="wxi-search" title="Zoom to domain(s)"/>