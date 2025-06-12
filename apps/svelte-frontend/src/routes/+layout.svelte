<script lang="ts">
	import '@fontsource/allison';
	import { onMount, setContext } from 'svelte';
	import { fade } from 'svelte/transition';
	import { dev } from '$app/environment';
	import { page } from '$app/state';
	import { PUBLIC_DEV_MEDIA_URL, PUBLIC_PROD_MEDIA_URL } from '$env/static/public';

	import { MIN_DESKTOP_SIZE } from '$lib/constants';
	import BottomSheet from '$lib/ui/BottomSheet.svelte';
	import AudioPlayer from './AudioPlayer.svelte';
	import LyricsCard from './LyricsCard.svelte';
	import PlaylistCard from './PlaylistCard.svelte';
	import type { Playlist } from './+page';
	import '../app.css';

	const WP_UPLOADS = dev ? PUBLIC_DEV_MEDIA_URL : PUBLIC_PROD_MEDIA_URL;
	const BG_OPACITY = 0.6;

	let { children, data } = $props();
	const { title, description } = data.response.data.generalSettings;
	const playlists: Playlist[] = data.response.data.playlists.nodes;

	setContext('playlists', playlists);

	let selectedId = $derived(page.url.searchParams.get('playlist'));
	let selectedPlaylist = $derived(playlists.find((p) => `${p.databaseId}` === selectedId));
	
	let lyricsWidth = $state(0);
	let showPlaylist = $state(false);

	setContext('showPlaylist', {
		get: () => (selectedPlaylist ? showPlaylist : false),
		set: (val: boolean) => (showPlaylist = val)
	});

	let audioPlayer = $state({
		title: '',
		artist: '',
		src: '',
		trackId: '',
		lyrics: '',
		playlist: <Playlist>{},
		paused: true,
		onSelectSong
	});
	setContext('audioPlayer', () => audioPlayer);

	function onSelectSong(file: string, playlistId: number) {
    const album = playlists.find((_) => _.databaseId === playlistId);
    const song = album?.tracks.find((track) => track.file === file);

    if (!song) throw new Error("A playlist with that song file could not be found.");

		audioPlayer = {
			artist: song.artist,
			src: song.file,
			trackId: song.id,
			title: song.title,
      lyrics: song.lyrics,
			paused: false,
			playlist: album!,
			onSelectSong
		};
	}

	let showLyrics = $state(false);
	
	let showBottomSheet = $derived(showPlaylist || showLyrics);
	let showAudioPlayer = $derived(audioPlayer.src);

	class Viewport {
		#vh = $state(0);						// viewport height
		#vw = $state(0);						// viewport width
		#y = $state(0);							// scroll y position
		#isDesktop = $state(false);	// screen width exceeds MIN_DESKTOP_SIZE
		
		get vh() { return this.#vh; }
		set vh(val) {
			this.#vh = val;
		}

		get vw() {
			return this.#vw;
		}
		set vw(val) {
			this.#vw = val;
			this.#isDesktop = val >= MIN_DESKTOP_SIZE;
		}

		get y(): number {
			return this.#y;
		}
		set y(val: number) {
			this.#y = val;
		}

		get isDesktop() {
			return this.#isDesktop;
		}

		constructor() {}
	}

	const vp = new Viewport();

	setContext('viewport', { w: () => vp.vw, h: () => vp.vh, isDesktop: () => vp.isDesktop });

	let opacity = $derived.by(() => {
		let hvh = vp.vh * 0.5;
		if (vp.y > hvh) {
			return 1 - BG_OPACITY;
		} else {
			return 1 - (BG_OPACITY / hvh) * vp.y;
		}
	});

	setContext('lyrics', {
		get: () => showLyrics,
		set: (val: boolean) => {
			if (val) showPlaylist = false; // Close playlist when opening lyrics
			showLyrics = val;
		}
	});

	let headerHeight = $state(0);

	let maskHeight = $state(0);
	let headerOffset = $derived(vp.isDesktop ? 64 : 0);
	let playerOffset = $derived(showAudioPlayer ? 88 : 0);
	let clipTop = $derived(vp.y + headerOffset);
	let clipBottom = $derived(maskHeight - vp.y - vp.vh + playerOffset);

	function hideBottomSheet() {
		showBottomSheet = !showBottomSheet;
		showPlaylist = false;
		showLyrics = false;
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.code === 'Space') {
			event.preventDefault();
			if (audioPlayer.src) {
				audioPlayer.paused = !audioPlayer.paused; 
			}
		}
	}
</script>

<svelte:head>
	<title>{`Randy & Linda - ${description}`}</title>
	<meta
		name="description"
		content="Songs of hurt, faith and hope. Original music written and performed by Randy and Linda Smith."
	/>
</svelte:head>

<svelte:window bind:innerWidth={vp.vw} bind:innerHeight={vp.vh} bind:scrollY={vp.y} onkeydown="{handleKeyDown}" />

{#snippet header()}
	<header
		class="grid h-[50vh] w-full grid-flow-row gap-4 lg:fixed lg:top-0 lg:flex lg:h-16 lg:justify-between lg:px-6"
		bind:clientHeight={headerHeight}
	>
		<h1 class="allison self-end text-center text-7xl lg:self-center lg:text-4xl">{@html title}</h1>
		<h2 class="allison self-start text-center text-5xl lg:self-center lg:text-4xl">
			<span class="hidden lg:inline">{@html description}</span>
			<span class="lg:hidden">Songs of Hope</span>
		</h2>
	</header>
{/snippet}

{#if vp.isDesktop}
	{@render header()}
{/if}

<div class="site-background fixed inset-0 -z-10 flex" style:opacity={vp.isDesktop ? '1' : opacity}>
	{#if vp.isDesktop}
		<video
			poster={`${WP_UPLOADS}/tropical-beach-aerial-loop.webp`}
			id="site-background__video"
			class="h-full w-full object-cover"
			muted
			autoplay
			loop
			disablepictureinpicture
			disableremoteplayback
			playsinline
		>
			<source
				src={`${WP_UPLOADS}/tropical-beach-aerial-loop.mp4`}
				type="video/mp4"
				role="presentation"
			/>
		</video>
		<!-- <picture class="fixed inset-0 flex">
			<img
				src={`${WP_UPLOADS}/2025/05/bg-waves__375-812-216.webp`}
				alt="Overhead view of a shoreline with small waves gently crashing on a beach"
				role="presentation"
				class="w-full object-cover object-left-bottom hidden"
			/>
		</picture> -->
	{:else}
		<picture class="fixed inset-0 flex">
			<source
				media="(min-width: 650px;)"
				srcset={`
					${WP_UPLOADS}/bg-waves__876-216.webp 2x,
					${WP_UPLOADS}/bg-waves__876-96.webp,
				`}
			/>
			<img
				src={`${WP_UPLOADS}/bg-waves__375-812-96.webp`}
				srcset={`${WP_UPLOADS}/bg-waves__375-812-216.webp 2x`}
				alt="Overhead view of a shoreline with small waves gently crashing on a beach"
				role="presentation"
				class="w-full object-cover object-left-bottom"
			/>
		</picture>
	{/if}
</div>

<div
	class="site-mask"
	style="--clipTop: {clipTop}px; --clipBottom: {clipBottom}px"
	bind:clientHeight={maskHeight}
>
	{#if !vp.isDesktop}
		{@render header()}
	{/if}

	<main class={['px-4 lg:py-24', { 'pb-24': !vp.isDesktop && showAudioPlayer }]}>
		<div class="main__container flex w-full flex-row gap-12">
			<div class="playlist-container min-w-1/2 2xl:min-w-3/5">
				{@render children()}
			</div>
			{#if vp.isDesktop}
				<div class="desktop-lyrics-container display-none lg:relative max-w-1/2 basis-1/2 shrink" bind:clientWidth={lyricsWidth}>
					{#if showLyrics && audioPlayer.lyrics}
						<div class="desktop-lyrics__content rounded-sm p-4 fixed backdrop-blur-sm" style:width="{lyricsWidth}px" style:background-color="rgba(255, 255, 255, 0.4)" transition:fade>
							<h1 class="text-xl font-bold">{@html audioPlayer.title}</h1>
							<p class="mb-4 text-sm">Written by {audioPlayer.artist}</p>
							<pre class="font-sans whitespace-pre-wrap">{audioPlayer.lyrics}</pre>
						</div>
					{/if}
				</div>
			{/if}
		</div>
		<div class="m-1 flex justify-between text-xs text-gray-900">
			<p>&copy; 2006-2025 Randy and Linda Smith</p>
			<p><a href="https://www.cxii.us">CXII</a></p>
		</div>
	</main>
</div>

<footer
	class={[
		'fixed inset-x-0 bottom-0 z-50 flex max-h-full flex-col justify-end overflow-hidden',
		showAudioPlayer ? 'audioplayer-open' : 'audioplayer-closed',
		showBottomSheet ? 'bottomsheet-open' : 'bottomsheet-closed'
	]}
>
	{#if !vp.isDesktop}
		<BottomSheet open={showBottomSheet} offset={playerOffset} onClick={hideBottomSheet}>
			{#if showPlaylist && selectedPlaylist}
				<PlaylistCard playlist={selectedPlaylist} bind:showPlaylist />
			{/if}
			{#if showLyrics && audioPlayer.lyrics}
				<LyricsCard lyrics={audioPlayer.lyrics} bind:showLyrics />
			{/if}
		</BottomSheet>
	{/if}
	{#if audioPlayer.src}
		<div class="audio-player__container h-22 w-full overflow-hidden pt-1" style:flex="0 0 5.5rem">
			<AudioPlayer bind:paused={audioPlayer.paused} bind:showPlaylist />
		</div>
	{/if}
</footer>

<style>
	.site-mask {
		clip-path: inset(var(--clipTop) 0 var(--clipBottom));
	}

	header {
		text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.3);
	}

	.audioplayer-open.bottomsheet-closed {
		height: 5.5rem;
	}
</style>
