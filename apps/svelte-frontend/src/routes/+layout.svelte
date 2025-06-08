<script lang="ts">
	import '@fontsource/allison';
	import { setContext } from 'svelte';
	import { page } from '$app/state';

	import { PUBLIC_DOMAIN_DEV } from '$env/static/public';
	import { MIN_DESKTOP_SIZE } from '$lib/constants';
	import AudioPlayer from './AudioPlayer.svelte';
	import PlaylistCard from './PlaylistCard.svelte';
	import LyricsCard from './LyricsCard.svelte';
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

	let showLyrics = $state(false);
	let currentLyrics = $derived(
		audioPlayer.src ? 
			playlists
				.find(p => p.databaseId === selectedPlaylist?.databaseId)
				?.tracks.find(t => t.file === audioPlayer.src)
				?.lyrics 
			: ''
	);

	let showBottomSheet = $derived(showPlaylist || showLyrics);
	let showAudioPlayer = $derived(audioPlayer.src);

	function onSelectSong(song: { artist: string; file: string; title: string; }, playlist: Playlist) {
		audioPlayer = {
			artist: song.artist,
			src: song.file,
			title: song.title,
			paused: false,
			playlist: selectedPlaylist!,
			onSelectSong
		}
	}

	class Viewport {
		#vh = $state(0);						// viewport height
		#vw = $state(0);						// viewport width
		#y = $state(0);							// scroll y position
		#isDesktop = $state(false);	// screen width exceeds MIN_DESKTOP_SIZE
		
		get vh() { return this.#vh; }
		set vh(val) {
			this.#vh = val;
		}

		get vw() { return this.#vw; }
		set vw(val) {
			this.#vw = val;
			this.#isDesktop =  (val >= MIN_DESKTOP_SIZE);
		}

		get y(): number {
			return this.#y;
		}
		set y(val: number) {
			this.#y = val;
		}

		get isDesktop() { return this.#isDesktop; }

		constructor() {}
	}

	const vp = new Viewport();

	setContext('viewport', { w: () => vp.vw, h: () => vp.vh, isDesktop: () => vp.isDesktop });

	let opacity = $derived.by(() => {
		let hvh = vp.vh * .5;
		if (vp.y > hvh) {
			return 1 - BG_OPACITY;
		} else {
			return 1 - (BG_OPACITY/hvh) * vp.y;
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
	let headerOffset = $derived(vp.isDesktop ? 64 : 0)
	let playerOffset = $derived(showAudioPlayer ? 88 : 0);
	let clipTop = $derived(vp.y + headerOffset);
	let clipBottom = $derived(maskHeight - vp.y - vp.vh + playerOffset);
</script>

<svelte:head>
  <title>{`Randy & Linda - ${description}`}</title>
	<meta name="description" content="Songs of hurt, faith and hope. Original music written and performed by Randy and Linda Smith.">
</svelte:head>

<svelte:window bind:innerWidth={vp.vw} bind:innerHeight={vp.vh} bind:scrollY={vp.y} />

{#snippet header()}
	<header class="h-[50vh] w-full grid grid-flow-row gap-4 lg:fixed lg:top-0 lg:h-16 lg:flex lg:justify-between lg:px-6" bind:clientHeight={headerHeight}>
		<h1 class="self-end allison text-center text-7xl lg:text-4xl lg:self-center">{@html title}</h1>
		<h2 class="self-start allison text-center text-5xl lg:text-4xl lg:self-center">{@html description}</h2>
	</header>
{/snippet}

{#if vp.isDesktop}
	{@render header()}
{/if}

<div class="site-background fixed inset-0 flex -z-10" style:opacity={opacity}>
	{#if vp.isDesktop}
		<video
			poster={`https://${PUBLIC_DOMAIN_DEV}app/uploads/tropical-beach-aerial-loop.webp`}
			id="site-background__video"
			class="object-cover w-full h-full"
			muted autoplay loop disablepictureinpicture disableremoteplayback playsinline
		>
			<source
				src={`https://${PUBLIC_DOMAIN_DEV}app/uploads/tropical-beach-aerial-loop.mp4`}
				type="video/mp4"
				role="presentation"
			/>
		</video>
	{:else}
		<picture class="fixed inset-0 flex">
			<source
				media="(min-width: 650px;)"
				srcset={`
					https://${PUBLIC_DOMAIN_DEV}app/uploads/2025/05/bg-waves__876-216.webp,
				`}
			/>
			<img
				src={`https://${PUBLIC_DOMAIN_DEV}app/uploads/2025/05/bg-waves__375-812-216.webp`}
				alt="Overhead view of a shoreline with small waves gently crashing on a beach"
				role="presentation"
				class="object-left-bottom object-cover w-full"
			/>
		</picture>
	{/if}
</div>

<div class="site-mask" style="--clipTop: {clipTop}px; --clipBottom: {clipBottom}px" bind:clientHeight={maskHeight}>
	{#if !vp.isDesktop}
		{@render header()}
	{/if}
	
	<main class={['px-4 lg:py-24', {'pb-24': !vp.isDesktop && showAudioPlayer}]}>
		<div class="main__container w-full">
			{@render children()}
			{#if showLyrics && currentLyrics && vp.isDesktop}
				<div class="lyrics-pane basis-[66%]">
					{@html currentLyrics}
				</div>
			{/if}
		</div>
		<div class="text-xs m-1 flex justify-between text-gray-900">
			<p>&copy; 2006-2025 Randy and Linda Smith</p>
			<p><a href="https://www.cxii.us">CXII</a></p>
		</div>
	</main>
</div>

<footer class={[ 
  'fixed inset-x-0 bottom-0 flex flex-col justify-end overflow-hidden z-50',
	showAudioPlayer ? 'audioplayer-open' : 'audioplayer-closed',
	showBottomSheet ? 'bottomsheet-open' : 'bottomsheet-closed',
]}>
	{#if !vp.isDesktop}
		{#if showPlaylist && selectedPlaylist}
			<PlaylistCard playlist={selectedPlaylist} bind:showPlaylist />
		{/if}
		{#if showLyrics && currentLyrics}
			<LyricsCard lyrics={currentLyrics} bind:showLyrics />
		{/if}
	{/if}
	{#if audioPlayer.src}
		<div class="audio-player__container w-full h-22 pt-1 overflow-hidden" style:flex="0 0 5.5rem">
			<AudioPlayer {...audioPlayer} bind:paused={audioPlayer.paused} bind:showPlaylist />
		</div>
	{/if}
</footer>

<style>
	.site-mask {
		clip-path: inset(var(--clipTop) 0 var(--clipBottom));
	}

	header {
		text-shadow: 1px 1px 2px rgba(255,255,255, 0.3);
	}

	.bottomsheet-open {
		top: 0;
		margin-top: 2rem;
	}

	/* .audioplayer-closed.bottomsheet-closed {
		clip-path: inset(100vh 0 0 0);
	} */
	
	/* .audioplayer-open.bottomsheet-open {
		clip-path: none;
		pointer-events: initial;
	} */
	
	.audioplayer-open.bottomsheet-closed {
		height: 5.5rem;
	}
</style>