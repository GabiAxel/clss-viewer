<script>
	import { getPointIndiceInEcodHierarchy } from '$lib/data.js';
	let { row, onaction } = $props()

	function onClick() {
		onaction({
			action: 'zoomtoindice',
			data: getPointIndiceInEcodHierarchy(row.id)
		})
	}
</script>

<button onclick={onClick} title="Zoom in plot" aria-label="Zoom in plot"><i class="mdi mdi-magnify-plus"></i></button>