<script lang="ts">
	import '@fontsource/allison';
	import { setContext } from 'svelte';
	import { page } from '$app/state';

	import { MIN_DESKTOP_SIZE } from '$lib/constants';
	import AudioPlayer from './AudioPlayer.svelte';
	import PlaylistCard from './PlaylistCard.svelte';
	import type { Playlist } from './+page';
	import '../app.css';

	const BG_OPACITY = 0.6;

	let { children, data } = $props();
	const { title, description } = data.response.data.generalSettings;
	const playlists: Playlist[] = data.response.data.playlists.nodes;

	let selectedId = $derived(page.url.searchParams.get('playlist'));
	let selectedPlaylist = $derived(playlists.find((p) => `${p.databaseId}` === selectedId));
	
	let showPlaylist = $state(false);
	// setContext('playlist', { isVisible: () => showPlaylist, playlist: () => selectedPlaylist, onSelectPlaylist });
	setContext('showPlaylist', {
		get: () => (selectedPlaylist) ? showPlaylist : false,
		set: (val: boolean) => showPlaylist = val
	})
	
	let audioPlayer = $state({ title: '', paused: true, src: '', artist: '', playlist: {}, onSelectSong });
	setContext('audioPlayer', () => audioPlayer);

	let showBottomSheet = $derived(showPlaylist || audioPlayer.src);

	function onSelectSong(song: { artist: string; file: string; title: string; }, playlist: Playlist) {
		audioPlayer = {
			artist: song.artist,
			src: song.file,
			title: song.title,
			paused: false,
			playlist: playlist,
			onSelectSong
		}
	}

	class Viewport {
		#vh = $state(0);						// viewport height
		#vw = $state(0);						// viewport width
		#y = $state(0);							// scroll y position
		#bottomOffset = $state(0);	// height of footer. distance from bottom to clear footer
		#isDesktop = $state(false);	// screen width exceeds MIN_DESKTOP_SIZE
		
		get vh() { return this.#vh; }
		set vh(val) {
			this.#vh = val;
		}

		get vw() { return this.#vw; }
		set vw(val) {
			this.#vw = val;
			this.#isDesktop =  (val > MIN_DESKTOP_SIZE);
		}

		get y(): number {
			return this.#y;
		}
		set y(val: number) {
			this.#y = val;
		}

		get bottomOffset() { return this.#bottomOffset; }
		set bottomOffset(val) {
			this.#bottomOffset = val;
		}

		get isDesktop() { return this.#isDesktop; }

		constructor() {}
	}

	const vp = new Viewport();

	setContext('viewport', { w: () => vp.vw, h: () => vp.vh, offset: () => vp.bottomOffset, isDesktop: () => vp.isDesktop });

	let opacity = $derived.by(() => {
		let hvh = vp.vh * .5;
		if (vp.y > hvh) {
			return 1 - BG_OPACITY;
		} else {
			return 1 - (BG_OPACITY/hvh) * vp.y;
		}
	});
</script>

<svelte:window bind:innerWidth={vp.vw} bind:innerHeight={vp.vh} bind:scrollY={vp.y} />

<header class="h-[50vh] w-full grid grid-flow-row gap-4 lg:h-16 lg:flex lg:justify-between lg:px-6">
	<h1 class="self-end allison text-center text-7xl lg:text-4xl lg:self-center">{@html title}</h1>
	<h2 class="self-start allison text-center text-5xl lg:text-4xl lg:self-center">{@html description}</h2>
</header>

<main>
	<picture class="fixed inset-0 flex -z-10" style:opacity={opacity}>
		<source
			media="(min-width: 650px)"
			srcset="https://hulagram.local/app/uploads/2025/05/bg-waves__876-216-scaled.webp"
		/>
		<source
			media="(max-width: 649px)"
			srcset="https://hulagram.local/app/uploads/2025/05/bg-waves__375-812-216.webp"
		/>
		<img
			src="https://hulagram.local/app/uploads/2025/05/bg-waves__375-812-216.webp"
			alt="Overhead view of a shoreline with small waves gently crashing on a beach"
			role="presentation"
			class="object-left-bottom object-cover w-full"
		/>
	</picture>
	<div class={['main__container', vp.isDesktop ? 'mx-auto' : 'mx-4']}>
		{@render children()}
	</div>
</main>

{#if showBottomSheet}
	<footer class={[
		'fixed bottom-0 left-0 right-0 flex flex-col items-stretch',
		{'top-0 mt-8': showPlaylist && selectedPlaylist}
	]}>
		{#if showPlaylist && selectedPlaylist}
			<PlaylistCard playlist={selectedPlaylist} bind:showPlaylist />
		{/if}
		{#if audioPlayer.src}
			<AudioPlayer {...audioPlayer} bind:paused={audioPlayer.paused} bind:showPlaylist />
		{/if}
	</footer>
{/if}