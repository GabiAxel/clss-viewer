<script>
	import _, { groupBy, map } from 'lodash-es';

	import { architectures, ecodHierarchy, tsneData } from '$lib/data.js'
	import { Grid } from 'wx-svelte-grid'
	import { onMount, tick } from 'svelte'
	import ZoomButton from '$lib/ZoomButton.svelte';
	import SelectButton from '$lib/SelectButton.svelte';

	let { onzoomtoindice, onselectindice } = $props()

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
		{id: 'label', header: {filter: 'text', clear: true}, flexgrow: 1, treetoggle: true}
	]

	let treeWrapper

	onMount(() => {
		tick().then(() => treeWrapper.querySelector('.wx-header input').placeholder = 'Search by ECOD hierarchy, name or domain ID...')
	})

	const treeInit = api => {

		api.on('filter-rows', ev =>
			api.getState().flatData.map(i => i.id).filter(i => i.startsWith('a.')).forEach(i => api.exec(ev.value ? 'open-row' : 'close-row', {id: i, nested: true}))
		)

	}
</script>

<div bind:this={treeWrapper} class="w-full h-full">
	<Grid
		tree={true}
		data={hierarchyTree}
		columns={treeColumns}
		init={treeInit}
		multiselect={true}
		onzoomtoindice={onzoomtoindice}
		onselectindice={onselectindice}/>
</div>