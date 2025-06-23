<script lang="ts">
	import '@fontsource/allison';
	import { setContext } from 'svelte';
	import { fade, slide } from 'svelte/transition';
	import { dev } from '$app/environment';
	import { page } from '$app/state';
	import { PUBLIC_DEV_MEDIA_URL, PUBLIC_DEV_URL, PUBLIC_PROD_MEDIA_URL, PUBLIC_PROD_URL } from '$env/static/public';

	import { MIN_DESKTOP_SIZE } from '$lib/constants';
	import type { Playlist } from '$lib/types';
	import BottomSheet from '$lib/ui/BottomSheet.svelte';
	import AudioPlayer from './AudioPlayer.svelte';
	import LyricsCard from './LyricsCard.svelte';
	import PlaylistCard from './PlaylistCard.svelte';
	import '../app.css';

	import { siteSettings } from '$lib/services/settings.svelte';
	import { goto } from '$app/navigation';
	import Tracklist from './Tracklist.svelte';
	// import { ApiClient } from '$lib/api';

	const WP_UPLOADS = dev ? PUBLIC_DEV_MEDIA_URL : PUBLIC_PROD_MEDIA_URL;
	const BG_OPACITY = 0.6;

	// const apiClient = new ApiClient({ baseUrl: dev ? PUBLIC_DEV_URL : PUBLIC_PROD_URL });
	
	let { children, data } = $props();
	const { title, description } = data.response.data.generalSettings;
	const playlists: Playlist[] = data.response.data.playlists.nodes;

	// let data = $state();

	// $onMount(async () => {
	// 	const query = `{
	// 		generalSettings {
	// 			title
	// 			description
	// 		},
	// 		playlists {
	// 			nodes {
	// 				databaseId
	// 				date
	// 				title
	// 				artistName
	// 				releaseDate
	// 				archive
	// 				tracks {
	// 					title
	// 					file
	// 					id
	// 					artist
	// 					lyrics
	// 					downloadable
	// 				}
	// 			}
	// 		}
	// 	}`;

	// 	try {
	// 		data = await apiClient.graphql(query);
	// 	} catch (error) {
	// 		console.error('Failed to fetch data', error);
	// 	} finally {
	// 		// loading = false;
	// 	}
	// });
	
	// let title = $state('');
	// let description = $state('');
	// let playlists = $state<Playlist[]>([]);

	setContext('playlists', playlists);

	let playlistId = $derived(page.url.searchParams.get('playlist'));
	let selectedPlaylist = $derived(playlists.find((p) => `${p.databaseId}` === playlistId));

	let showPlaylist = $state(false);
	let showAboutUs = $derived(page.route.id?.includes('about-randy-and-linda'));

	let lyricsWidth = $state(0);

	let video = $state<HTMLMediaElement>();

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

		if (!song) throw new Error('A playlist with that song file could not be found.');

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

	let showBottomSheet = $derived(showPlaylist || showLyrics || !!showAboutUs);
	let showAudioPlayer = $derived(audioPlayer.src);

	class Viewport {
		#vh = $state(0);						// viewport height
		#vw = $state(0);						// viewport width
		#y = $state(0);							// scroll y position
		#isDesktop = $state(false);	// screen width exceeds MIN_DESKTOP_SIZE
		
		get vh() {
			return this.#vh;
		}
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
		// clear about-randy-and-linda route
		const params = new URLSearchParams(window.location.search);
    params.get('playlist');
    goto(`/?${params.toString()}`, { keepFocus: true, replaceState: true, noScroll: true });
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.code === 'Space') {
			event.preventDefault();
			if (audioPlayer.src) {
				audioPlayer.paused = !audioPlayer.paused;
			}
		}
	}

	function selectPlaylist(id: number) {
    const params = new URLSearchParams(window.location.search);
    params.set('playlist', `${id}`);
    goto(`?${params.toString()}`, { keepFocus: true, replaceState: false, noScroll: true })
			.then(() => {
				const titleElement = document.getElementById(`playlist-${id}`);
				const offsetTop = titleElement?.offsetTop;
				window.scrollTo({top: offsetTop, behavior: 'smooth'});
			});
    // if (!vp.isDesktop) showPlaylistCtx.set(true);
    if (!vp.isDesktop) { 
			showPlaylist = true;
		}
  }

	function gotoAbout(event: Event) {
		event.preventDefault();
		showLyrics = false;
		const params = new URLSearchParams(window.location.search);
		goto(`about-randy-and-linda?${params.toString()}`, { noScroll: vp.isDesktop == false});
	}

	$effect(() => {
		if (!siteSettings.playVideo) {
			video?.pause();
		} else {
			video?.play()
		}
	});
</script>

<svelte:head>
	<title>{`Randy & Linda - ${description}`}</title>
	<meta
		name="description"
		content="Songs of hurt, faith and hope. Original music written and performed by Randy and Linda Smith."
	/>
</svelte:head>

<svelte:window
	bind:innerWidth={vp.vw}
	bind:innerHeight={vp.vh}
	bind:scrollY={vp.y}
	onkeydown={handleKeyDown}
/>

{#snippet header()}
	<header class="lg:fixed lg:top-0 w-full" bind:clientHeight={headerHeight}
	>
		<div class="banner info bg-yellow-200 p-4">
			<p>Your browser appears to have JavaScript disabled. To experience RandyAndLinda.com as it was intended, turn on JavaScript and refresh the page.</p>
		</div>
		<div class="grid h-[50vh] w-full grid-flow-row gap-4 lg:flex lg:h-16 lg:justify-between lg:px-6">
			<h1 class="site-title allison self-end text-center text-7xl lg:self-center lg:text-4xl">
				<a href="about-randy-and-linda" class="inline-flex" onclick={gotoAbout}>
					<span class="about-text hidden w-fit">About</span>
					{@html title}
				</a>
			</h1>
			<h2 class="allison self-start text-center text-5xl lg:self-center lg:text-4xl">
				<span class="hidden lg:inline">{@html description}</span>
				<span class="lg:hidden">Songs of Hope</span>
			</h2>
		</div>
	</header>
{/snippet}

{#if vp.isDesktop}
	{@render header()}
{/if}

<div class="site-background fixed inset-0 -z-10 flex" style:opacity={vp.isDesktop ? '1' : opacity}>
	{#if vp.isDesktop}
		<video
			bind:this={video}
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
				<ul class="">
					{#each playlists as playlist}
						<li class="playlist py-6" id={`playlist-${playlist.databaseId}`}>
							<div class="playlist__title" >
								<button type="button" onclick={() => selectPlaylist(playlist.databaseId)}>
									{@html playlist.title}
								</button>
							</div>
							{#if vp.isDesktop && playlistId === `${playlist.databaseId}`}
								<div transition:slide>
									<div class="playlist__meta flex h-14 py-2 items-center justify-between">
										<p class="playlist__artist text-sm italic">{playlist.artistName}</p>
										{#if playlist.archive}
											<div class="hidden lg:inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 has-[>svg]:px-3">
												<a href="{playlist.archive}" class="button" data-sveltekit-preload-data="tap" download>Download all</a>
											</div>
										{/if}
									</div>
									<Tracklist playlist={playlist} isDesktop={vp.isDesktop} />
								</div>
							{/if}
						</li>
					{/each}
					<li class="hr py-1">
						<hr/>
					</li>
					<li class="py-6">
						<div class="playlist__title">
							<button onclick={gotoAbout}>
								About Us
							</button>
						</div>
					</li>
				</ul>
			</div>
			{#if vp.isDesktop}
				<div
					class="desktop-lyrics-container display-none max-w-1/2 shrink basis-1/2 lg:relative"
					bind:clientWidth={lyricsWidth}
				>
					{#if (showLyrics && audioPlayer.lyrics) || showAboutUs}
						<div
							class={[
								'desktop-lyrics__content fixed rounded-sm p-4',
								{ 'backdrop-blur-sm': siteSettings.useFrostedOpacity }
							]}
							style:width="{lyricsWidth}px"
							style:background-color={siteSettings.useFrostedOpacity ? 'rgba(255, 255, 255, 0.4)' : 'rgba(239,255,252, 0.75)'}
							transition:fade
						>
							{@render children()}
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
			{#if showAboutUs}
				<article class="flex flex-col">
					<main class="lyrics__content pb-4">
						{@render children()}
					</main>
				</article>
			{/if}
		</BottomSheet>
	{/if}
	{#if audioPlayer.src}
		<div class="audio-player__container h-22 w-full overflow-hidden pt-1" style:flex="0 0 5.5rem">
			<AudioPlayer bind:paused={audioPlayer.paused} bind:showPlaylist isDesktop={vp.isDesktop} />
		</div>
	{/if}
</footer>

<style>
	:global {
		.js header .banner {
			display: none;
		}
	}

	.site-mask {
		clip-path: inset(var(--clipTop) 0 var(--clipBottom));
	}

	header {
		text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.3);
	}

	.audioplayer-open.bottomsheet-closed {
		height: 5.5rem;
	}

	.site-title:hover .about-text {
		display: inline;
		padding-right: .5rem;
		/* translate: scaleX(1); */
	}

	.playlist__title button {
		line-height: 1;
		text-align: left;
		text-transform: uppercase;
	}

	.button {
    text-align: inherit;
    text-transform: inherit;
    line-height: 1;
  }
</style>
