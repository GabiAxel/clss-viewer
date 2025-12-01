<script>
	import { getPointIndicesInEcodHierarchy } from '$lib/data.js';
	let { row, onaction } = $props()

	function onClick() {
		onaction({
			action: 'deselectindices',
			data: getPointIndicesInEcodHierarchy(row.id)
		})
	}
</script>

<button onclick={onClick} title="Remove" aria-label="Remove"><i class="mdi mdi-close"></i></button>