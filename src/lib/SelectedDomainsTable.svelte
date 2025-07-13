<script>
import { Grid } from 'wx-svelte-grid'

const columns = [
	{id: 'ecod_id', header: 'Domain ID'},
	{id: 'f_id', header: 'F-ID'},
	{id: 'x', header: 'X'},
	{id: 'y', header: 'Y'}
]

let { selected } = $props()
</script>

{#if selected.length == 0}
	<div class="w-full h-full flex items-center justify-center">
		<p>Selected domains will appear here</p>
	</div>
{:else}
	<Grid columns={columns} data={selected}/>
{/if}