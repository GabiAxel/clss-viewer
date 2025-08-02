<script>
	import _, { groupBy, map } from 'lodash-es';
	import { architectures, ecodHierarchy, tsneData } from '$lib/data.js'
	import { Grid } from 'wx-svelte-grid'
	import { Text } from 'wx-svelte-core'
	import ZoomButton from '$lib/ZoomButton.svelte'
	import SelectButton from '$lib/SelectButton.svelte'

	let { onzoomtoindice, onselectindice, onLoaded } = $props()
	let treeGrid = $state()

	const fGroupDomains = groupBy(tsneData, 'f_id')

	const getDomains = f_id =>
		(fGroupDomains[f_id] || [])
			.map(x => ({
				id: x.ecod_id,
				label: x.ecod_id,
				is_domain: true
			}))

	const buildTreeHierarchy = (arch_id, level_id) => {
		return _(ecodHierarchy)
			.filter(x => x.a_id == arch_id && x.parent == level_id)
			.map(x => ({
				id: x.level_id.toString(),
				label: `${x.level_id} - ${x.name}`,
				open: false,
				level_id: x.level_id,
				data: x.is_f ? getDomains(x.level_id) : buildTreeHierarchy(arch_id, x.level_id)
			}))
			.value()
	}

	let hierarchyTree = map(architectures, a => ({
		id: `a.${a.id}`,
		label: a.name,
		open: false,
		data: buildTreeHierarchy(a.id, '')
	}))

	const treeColumns = [
		{id: 'select', cell: SelectButton, width: 40},
		{id: 'zoom', cell: ZoomButton, width: 40},
		{id: 'label', flexgrow: 1, treetoggle: true}
	]

	const applyFilter = ({ value }) => {
		treeGrid.getState().flatData.map(i => i.id).filter(i => i.startsWith('a.')).forEach(i => treeGrid.exec(value ? 'open-row' : 'close-row', {id: i, nested: true}))
		treeGrid.exec('filter-rows', { filter: ({ label }) => label.includes(value) })
	}

	onLoaded()

</script>

<div class="w-full h-full flex flex-col">
	<div class="border-b-1 border-gray-700 p-1">
		<Text icon="mdi mdi-magnify" placeholder="Search by ECOD hierarchy, name or domain ID..." onchange={applyFilter} clear/>
	</div>
	<div class="flex-1 overflow-hidden ecod-tree-grid">
		<Grid
			bind:this={treeGrid}
			tree={true}
			data={hierarchyTree}
			columns={treeColumns}
			select={false}
			onzoomtoindice={onzoomtoindice}
			onselectindice={onselectindice}/>
	</div>
</div>

<style>
	:global(.ecod-tree-grid .wx-header) {
			display: none;
	}
</style>