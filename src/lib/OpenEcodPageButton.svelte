<script>
	let { row, onaction } = $props()

	function onClick() {
		onaction({
			action: 'openecodpage',
			data: row.ecod_id
		})
	}
</script>

<button onclick={onClick} title="Open ECOD domain page" aria-label="Open ECOD domain page"><i class="mdi mdi-open-in-new"></i></button>