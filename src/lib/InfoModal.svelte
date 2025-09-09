<script>
	import { Button } from 'wx-svelte-core'

	const { show, onClose } = $props()
</script>

<svelte:window on:keydown={event => {if(event.key === 'Escape') onClose()}}/>
<div class={`fixed z-50 inset-0 flex items-center justify-center ${show ? 'block' : 'hidden'}`}`>
	<div class="absolute inset-0 bg-gray-500 opacity-50" onclick={onClose}></div>
	<div class="relative bg-white dark:bg-gray-900 shadow-lg p-4 max-w-xl">
		Supplementary website for:<br/>
		Yanai, G., Axel, G., Longo, L.M., Ben-Tal, N., Kolodny, R., 2025.
		<strong>Contrastive learning unites sequence and structure in a global representation of protein space</strong>
		<i>bioRxiv</i> <a href="https://doi.org/10.1101/2025.09.05.674454" target="_blank">https://doi.org/10.1101/2025.09.05.674454</a>
		<br/><br/>
		Use the left pane to browse and search for ECOD domains.
		Click <i class="mdi mdi-magnify-plus"></i> to zoom into domains in the t-SNE plot.
		The deeper the level is - the more noticeable the zoom will be.
		<br/><br/>
		Click <i class="mdi mdi-check-circle"></i> to select domains.
		You can also click on points in the t-SNE plot to select the corresponding domains.
		Selected domains will be highlighted in the t-SNE plot and appear in the table at the bottom.
		<br/><br/>
		Click and drag the t-SNE plot area to pan it in any direction, and use the mouse wheel to zoom in and out.
		Press and hold the Shift key to activate "lasso mode", and click the mouse while dragging around an area to select multiple domains.
		<br/><br/>
		The table at the bottom can be downloaded as a CSV file.
		<br/><br/>
		<strong>Code repositories</strong><br/>
		{#each ['guyyanai/CLSS/', 'GabiAxel/clss-viewer'] as repo (repo)}
			<a href={`https://github.com/${repo}`} target="_blank" aria-label="GitHub" class="block"><i class="mdi mdi-github"></i> https://github.com/{repo}</a>
		{/each}
		<br/>
		<div class="flex justify-end">
			<Button class="float-end" onclick={onClose}>Close</Button>
		</div>
	</div>
</div>