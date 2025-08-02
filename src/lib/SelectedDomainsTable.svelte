<script>
import _, { map, escape } from 'lodash-es'
import { Grid } from 'wx-svelte-grid'
import { Button } from 'wx-svelte-core'
import download from 'downloadjs'
import { tsneData } from '$lib/data.js';

const columns = [
	{id: 'ecod_id', header: 'Domain ID'},
	{id: 'f_id', header: 'F-ID'},
	{id: 'a_name', header: 'Architecture', flexgrow: 1},
	{id: 'x_name', header: 'X-group', flexgrow: 1},
	{id: 'h_name', header: 'H-Group', flexgrow: 1},
	{id: 't_name', header: 'T-Group', flexgrow: 1},
	{id: 'f_name', header: 'F-Group', flexgrow: 1},
	{id: 'x', header: 'X'},
	{id: 'y', header: 'Y'}
]

let { selectedIndice, onSelectIndice } = $props()

let domains = $derived(selectedIndice.map(i => tsneData[i]))

function downloadCSV() {
	let csvString = map(columns, 'header') + '\n' +
		_(domains).map(domain => _(columns).map(({id}) => id).map(i => ['x', 'y'].includes(i) ? domain[i] : `"${escape(domain[i])}"`).join(',')).join('\n')
	download(csvString, 'CLSS_domains.csv', 'text/csv')
}

</script>

{#if domains.length == 0}
	<div class="w-full h-full flex items-center justify-center">
		<p>Selected domains will appear here</p>
	</div>
{:else}
	<div class="w-full h-full flex-row overflow-hidden">
		<div class="flex border-b-1 border-gray-700">
			<strong class="p-2 flex-1">
				{#if domains.length == 1}
					1 domain
				{:else}
					{domains.length} domains
				{/if}
			</strong>
			<Button icon="mdi mdi-download" onclick={downloadCSV}>Download</Button>
			<Button icon="mdi mdi-close" onclick={() => onSelectIndice([])}>Clear</Button>
		</div>
		<Grid columns={columns} data={domains}/>
	</div>
{/if}