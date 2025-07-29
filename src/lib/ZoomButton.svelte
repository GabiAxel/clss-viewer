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

<button onclick={onClick} title="Zoom to domain(s)" aria-label="Zoom to domain(s)"><i class="mdi mdi-magnify-plus"></i></button>