<script lang="ts">
	import { getContext } from 'svelte';
	import { goto } from '$app/navigation';
	import IconButton from '$lib/ui/IconButton.svelte';

	let { data } = $props();

	const { title, content } = data.page;

	let vp: { isDesktop: () => boolean } = getContext('viewport');

	function closeAboutPane() {
		const params = new URLSearchParams(window.location.search);
		goto(`/?${params.toString()}`, { noScroll: true });
	}
</script>

<div class="about-page">
	<div class="flex flex-row justify-between">
		<h1 class="text-3xl">{title}</h1>
		{#if vp.isDesktop()}
			<IconButton
				size="xs"
				class="btn__close-about -mt-2 -mr-3"
				label="Close"
				onClick={closeAboutPane}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					width="100%"
					height="100%"
					id="close-icon"
				>
					<path
						d="m15.707,9.707l-2.293,2.293,2.293,2.293c.391.391.391,1.023,0,1.414-.195.195-.451.293-.707.293s-.512-.098-.707-.293l-2.293-2.293-2.293,2.293c-.195.195-.451.293-.707.293s-.512-.098-.707-.293c-.391-.391-.391-1.023,0-1.414l2.293-2.293-2.293-2.293c-.391-.391-.391-1.023,0-1.414s1.023-.391,1.414,0l2.293,2.293,2.293-2.293c.391-.391,1.023-.391,1.414,0s.391,1.023,0,1.414Zm8.293,2.293c0,6.617-5.383,12-12,12S0,18.617,0,12,5.383,0,12,0s12,5.383,12,12Zm-2,0c0-5.514-4.486-10-10-10S2,6.486,2,12s4.486,10,10,10,10-4.486,10-10Z"
					/>
				</svg>
			</IconButton>
		{/if}
	</div>
	<p>{@html content}</p>
</div>
