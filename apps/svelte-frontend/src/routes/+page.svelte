<script lang="ts">
	import { getContext } from 'svelte';

	const getAudioPlayer: any = getContext('audioPlayer');
	let audioPlayer = $derived(getAudioPlayer());
</script>

{#if audioPlayer.lyrics}
	<div>
		<h1 class="text-xl font-bold">{@html audioPlayer.title}</h1>
		<p class="mb-4 text-sm">Written by {audioPlayer.artist}</p>
		<pre class="font-sans whitespace-pre-wrap">{audioPlayer.lyrics}</pre>
	</div>
{/if}
