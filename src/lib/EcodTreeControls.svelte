<script>
	import { getPointIndicesInEcodHierarchy } from '$lib/data.js'
	let { row, onaction } = $props()

	const onClick = action =>
		() => onaction({
			action,
			data: getPointIndicesInEcodHierarchy(row.id)
		})
</script>

<div class="flex items-center justify-between w-full px-1">
	<button onclick={onClick('selectindices')} title="Select domain(s)" aria-label="Select domain(s)"><i class="mdi mdi-check-circle"></i></button>
	<button onclick={onClick('deselectindices')} title="Deselect domain(s)" aria-label="Deselect domain(s)"><i class="mdi mdi-circle-off-outline"></i></button>
	<button onclick={onClick('zoomtoindices')} title="Zoom in plot" aria-label="Zoom in plot"><i class="mdi mdi-loupe"></i></button>
<!--	<button onclick={onClick('appendvisibleindices')} title="Show domains" aria-label="Show domains"><i class="mdi mdi-eye-outline"></i></button>-->
<!--	<button onclick={onClick('setonlyvisibleindices')} title="Hide other domains" aria-label="Hide other domains"><i class="mdi mdi-eye-off-outline"></i></button>-->
</div>