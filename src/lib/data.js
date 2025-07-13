import Papa from 'papaparse'
import { filter, map } from 'lodash-es';

import rawArchitectures from './assets/architectures.csv?raw'
import rawEcodHierarchy from './assets/F40_hierarchy.cvs?raw'
import rawTsneData from './assets/F40-tsne-reduced.csv?raw'

export const architectures = Papa.parse(rawArchitectures, {header: true}).data

export const ecodHierarchy = map(filter(Papa.parse(rawEcodHierarchy, {header: true}).data, 'level_id'), x => {
	const matches = x.level_id.match(/\./g)
	const is_f = matches && matches.length == 3
	const parent = x.level_id.substring(0, x.level_id.lastIndexOf('.'))
	return {...x, parent, is_f}
})

export const tsneData = Papa.parse(rawTsneData, {header: true, dynamicTyping: true}).data.filter(x => !!x.ecod_id)