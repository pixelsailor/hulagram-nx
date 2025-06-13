<script lang="ts">
	import Toolbar from '$lib/ui/Toolbar.svelte';
	import IconButton from '$lib/ui/IconButton.svelte';
	import type { Playlist } from '$lib/types';
	import { getContext } from 'svelte';

	let { paused = $bindable<boolean>(), showPlaylist = $bindable() } = $props();

	const getAudioPlayer: any = getContext('audioPlayer');
	let audioPlayer = $derived(getAudioPlayer());

	let title = $derived(audioPlayer.title);
	let artist = $derived(audioPlayer.artist);
	let src = $derived(audioPlayer.src);
	let lyrics = $derived(audioPlayer.lyrics);
	let playlist = $derived(audioPlayer.playlist);

	let playerWidth = $state();

	let time = $state(0);
	let duration = $state(0);

	let hasNext = $state(true);
	let currentTrackIndex = $derived(
		(playlist as Playlist).tracks.findIndex((track) => track.file === src)
	);

	let hasLyrics = $derived(!!lyrics);

	const lyricsCtx: any = getContext('lyrics');

	function toggleLyrics() {
		lyricsCtx.set(!lyricsCtx.get());
	}

	function format(time: number) {
		if (isNaN(time)) return '--:--';

		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);

		return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
	}

	function playNext() {
		if (!playlist.tracks) return;
		const nextIndex = currentTrackIndex + 1;
		hasNext = nextIndex < playlist.tracks.length;
		if (hasNext) {
			const nextTrack = playlist.tracks[nextIndex];
			audioPlayer.src = nextTrack.file;
			audioPlayer.trackId = nextTrack.id;
			audioPlayer.title = nextTrack.title;
			audioPlayer.artist = nextTrack.artist;
			audioPlayer.lyrics = nextTrack.lyrics;
			time = 0;
			audioPlayer.paused = false;
		}
	}
</script>

<div class={['audio-player relative py-3', { paused }]} bind:clientWidth={playerWidth}>
	<audio {src} bind:currentTime={time} bind:duration bind:paused onended={playNext}></audio>
	<div
		class="audio-player__slider"
		onpointerdown={(e) => {
			const div = e.currentTarget;

			function seek(e: any) {
				const { left, width } = div.getBoundingClientRect();
				let p = (e.clientX - left) / width;
				if (p < 0) p = 0;
				if (p > 1) p = 1;

				time = p * duration;
			}

			seek(e);

			window.addEventListener('pointermove', seek);

			window.addEventListener(
				'pointerup',
				() => {
					window.removeEventListener('pointermove', seek);
				},
				{ once: true }
			);
		}}
	>
		<div
			class="progress"
			style="--progress: {time / duration}%; --slider-width: {playerWidth}px;"
		></div>
	</div>
	<Toolbar>
		<div class="audio-player__info w-full flex-auto overflow-hidden lg:w-1/2">
			<div class="audio-player__description w-full">
				<p class="song-title truncate font-bold">{title}</p>
				<p class="truncate text-sm">
					<span class="artist-name">{artist || playlist.artistName}</span> &mdash;
					<span class="album-name"><a href="?playlist={playlist.databaseId}">{playlist.title}</a></span>
				</p>
			</div>
			<p class="audio-player__time text-sm text-gray-900">
				<span>{format(time)}</span> / <span>{duration ? format(duration) : '--:--'}</span>
			</p>
		</div>
		<div class="flex flex-row flex-nowrap lg:w-1/2 lg:basis-1/2 grow-0 lg:shrink lg:justify-between">
			<div class="flex flex-row flex-nowrap">
				<IconButton onClick={() => (paused = !paused)} title={paused ? 'Play' : 'Pause'}>
					{#if paused}
						<svg
							id="play-icon"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
							width="100%"
							height="100%"
						>
							<path
								d="m12.421 10.549c.963.57 1.65 1.077 2.106 1.451-.456.374-1.144.88-2.106 1.451-.938.556-1.702.912-2.248 1.133-.089-.597-.173-1.46-.173-2.583s.084-1.987.173-2.583c.546.221 1.31.577 2.248 1.132zm10.579 1.451c0 7.71-3.29 11-11 11s-11-3.29-11-11 3.29-11 11-11 11 3.29 11 11zm-6.253-.665c-.173-.193-1.141-1.223-3.307-2.506-2.312-1.37-3.751-1.683-3.812-1.696-.499-.106-.998.183-1.156.668-.02.059-.473 1.478-.473 4.199s.453 4.14.473 4.199c.156.489.668.774 1.156.668.061-.013 1.5-.326 3.812-1.696 2.166-1.283 3.134-2.313 3.307-2.506.337-.379.337-.951 0-1.33z"
							/>
						</svg>
					{:else}
						<svg
							id="pause-icon"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
							width="100%"
							height="100%"
						>
							<path
								d="m12 1c-7.71 0-11 3.29-11 11s3.29 11 11 11 11-3.29 11-11-3.29-11-11-11zm-1 14c0 .552-.447 1-1 1s-1-.448-1-1v-6c0-.552.447-1 1-1s1 .448 1 1zm4 0c0 .552-.447 1-1 1s-1-.448-1-1v-6c0-.552.447-1 1-1s1 .448 1 1z"
							/>
						</svg>
					{/if}
				</IconButton>
				<IconButton onClick={() => (time = duration)} disabled={!hasNext} class={hasLyrics ? '0' : '-mr-2'}>
          <svg width="100%" height="100%" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" id="play-next-icon">
            <path d="M23,12C23,19.71 19.71,23 12,23C4.29,23 1,19.71 1,12C1,4.29 4.29,1 12,1C19.71,1 23,4.29 23,12ZM18,15L18,9C18,8.448 17.553,8 17,8C16.447,8 16,8.448 16,9L16,15C16,15.552 16.447,16 17,16C17.553,16 18,15.552 18,15ZM14.747,11.335C14.574,11.142 13.606,10.112 11.44,8.829C9.128,7.459 7.689,7.146 7.628,7.133C7.129,7.027 6.63,7.316 6.472,7.801C6.452,7.86 5.999,9.279 5.999,12C5.999,14.721 6.452,16.14 6.472,16.199C6.628,16.688 7.14,16.973 7.628,16.867C7.689,16.854 9.128,16.541 11.44,15.171C13.606,13.888 14.574,12.858 14.747,12.665C15.084,12.286 15.084,11.714 14.747,11.335ZM10.421,10.549C11.384,11.119 12.071,11.626 12.527,12C12.071,12.374 11.383,12.88 10.421,13.451C9.483,14.007 8.719,14.363 8.173,14.584C8.084,13.987 8,13.124 8,12.001C8,10.878 8.084,10.014 8.173,9.418C8.719,9.639 9.483,9.994 10.421,10.549Z"/>
        </svg>
				</IconButton>
			</div>
			{#if hasLyrics}
				<IconButton
					onClick={toggleLyrics}
					disabled={!hasLyrics}
					title="{lyricsCtx.get() ? 'Hide' : 'Show'} lyrics"
					class="-mr-2"
				>
					<svg id="lyrics-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
						<path
							style:fill={lyricsCtx.get() ? 'black' : 'white'}
							d="m20.088 2.783c-.08-.359-.352-.646-.706-.746-.15-.042-3.73-1.037-7.382-1.037s-7.231.995-7.382 1.037c-.354.1-.626.387-.706.746-.037.168-.912 4.165-.912 9.217s.875 9.049.912 9.217c.08.359.352.646.706.746.15.042 3.73 1.037 7.382 1.037s7.231-.995 7.382-1.037c.354-.1.626-.387.706-.746.037-.168.912-4.165.912-9.217s-.875-9.049-.912-9.217zm-9.088 13.217h-3c-.553 0-1-.447-1-1s.447-1 1-1h3c.553 0 1 .447 1 1s-.447 1-1 1zm5-4h-8c-.553 0-1-.447-1-1s.447-1 1-1h8c.553 0 1 .447 1 1s-.447 1-1 1zm0-4h-8c-.553 0-1-.447-1-1s.447-1 1-1h8c.553 0 1 .447 1 1s-.447 1-1 1z"
						/>
					</svg>
				</IconButton>
			{/if}
		</div>
	</Toolbar>
</div>

<style>
	svg path {
		fill: white;
		filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.25));
	}

	.audio-player__slider {
		position: absolute;
		top: -0.25rem;
		left: 0;
		right: 0;
		height: 0.25rem;
		overflow: hidden;
	}

	.progress {
		background-color: white;
		width: calc(var(--slider-width) - (100 * var(--progress)));
		height: 100%;
		position: absolute;
		right: 0;
		top: 0;
	}
</style>
