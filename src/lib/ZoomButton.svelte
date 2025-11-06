<script>
	import { getPointIndicesInEcodHierarchy } from '$lib/data.js';
	let { row, onaction } = $props()

	function onClick() {
		onaction({
			action: 'zoomtoindice',
			data: getPointIndicesInEcodHierarchy(row.id)
		})
	}
</script>

<button onclick={onClick} title="Zoom in plot" aria-label="Zoom in plot"><i class="mdi mdi-loupe"></i></button>