import Papa from 'papaparse'
import _, { filter, map } from 'lodash-es';

import rawArchitectures from './assets/architectures.csv?raw'
import rawEcodHierarchy from './assets/F100_hierarchy.cvs?raw'
import rawTsneData from './assets/F100-tsne-reduced.csv?raw'

export const architectures = Papa.parse(rawArchitectures, {header: true}).data

const architectureIdNameMap = _(architectures).map(({id, name}) => ([id, name])).fromPairs().value()

export const ecodHierarchy = map(filter(Papa.parse(rawEcodHierarchy, {header: true}).data, 'level_id'), x => {
	const matches = x.level_id.match(/\./g)
	const is_f = matches && matches.length == 3
	const parent = x.level_id.substring(0, x.level_id.lastIndexOf('.'))
	return {...x, parent, is_f}
})

const ecodIdNameMap = _(ecodHierarchy).map(({level_id, name}) => ([level_id, name])).fromPairs().value()

export const tsneData = Papa.parse(rawTsneData, {header: true, dynamicTyping: true}).data
	.filter(x => !!x.ecod_id)
	.map(({ecod_id,f_id,a_id,x,y}) => {
		const a_name = architectureIdNameMap[a_id]
		const f_name = ecodIdNameMap[f_id]
		const t_id = f_id.substring(0,f_id.lastIndexOf('.'))
		const t_name = ecodIdNameMap[t_id]
		const h_id = t_id.substring(0,t_id.lastIndexOf('.'))
		const h_name = ecodIdNameMap[h_id]
		const x_id = h_id.substring(0,h_id.lastIndexOf('.'))
		const x_name = ecodIdNameMap[x_id]
		return {ecod_id, a_id, f_id, a_name, x_name, h_name, t_name, f_name, x, y}
	})

const ecodIndex = _(tsneData).map(({ecod_id}, index) => [ecod_id, index]).fromPairs().value()

export const getPointIndiceInEcodHierarchy = id => {
	id = id.toString()
	let domainIds
	if(id.startsWith('a.')) {
		const a_id = parseInt(id.substring(2))
		domainIds = tsneData.filter(x => x.a_id == a_id).map(x => x.ecod_id)
	} else if(/^[0-9.]+$/.test(id)) {
		domainIds = tsneData.filter(x => x.f_id == id || x.f_id.startsWith(`${id}.`)).map(x => x.ecod_id)
	} else {
		domainIds = [id]
	}
	return domainIds.map(ecod_id => ecodIndex[ecod_id])
}