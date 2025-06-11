<script lang="ts">
	import { getContext } from 'svelte';
	import { LIST_ITEM_PADDING } from '$lib/constants';
	import { type Playlist, type Track } from '$lib/types';
	import IconButton from '$lib/ui/IconButton.svelte';

	let { playlist, isDesktop }: { playlist: Playlist; isDesktop: boolean } = $props();

	const getAudioPlayer: any = getContext('audioPlayer');
	let audioPlayer = $derived(getAudioPlayer());
  
	let tracklist = $derived(playlist.tracks);

	let allowDownloads = $state(false);

	function selectSongHandler(file: string) {
		audioPlayer.onSelectSong(file, playlist.databaseId);
	}
</script>

<ul class="playlist__tracks">
	{#each tracklist as track}
		<li
			class={[
				`playlist__track flex h-14 items-center py-${LIST_ITEM_PADDING} lg:gap-1 lg:rounded-sm lg:pr-2 lg:pl-4 lg:backdrop-blur-sm`,
				{ 'desktop-track': isDesktop }
			]}
		>
			<div class="playlist__track basic-[fit-content] grow">
				<p class="playlist__track__name">{track.title}</p>
			</div>
			{#if track.downloadable && isDesktop && allowDownloads}
				<IconButton label="Download">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						class="download-icon"
						width="100%"
						height="100%"
						fill="currentColor"
					>
						<path
							d="M12,1C6.878,1,1,2.25,1,12c0,7.71,3.29,11,11,11,5.122,0,11-1.25,11-11,0-7.71-3.29-11-11-11Zm0,21c-7.103,0-10-2.897-10-10S4.897,2,12,2s10,2.897,10,10-2.897,10-10,10Z"
						/>
						<g>
							<path
								d="M12,1C6.878,1,1,2.25,1,12c0,7.71,3.29,11,11,11,5.122,0,11-1.25,11-11,0-7.71-3.29-11-11-11Zm0,21c-7.103,0-10-2.897-10-10S4.897,2,12,2s10,2.897,10,10-2.897,10-10,10Z"
							/>
							<path
								d="M15.517,11.466c-.064-.035-1.452-.794-3.017-.933v-3.783c0-.276-.224-.5-.5-.5s-.5,.224-.5,.5v3.788c-1.575,.159-2.964,.968-3.028,1.006-.188,.111-.283,.332-.233,.545,.8,3.415,3.339,5.47,3.45,5.552,.344,.255,.634-.01,.648-.022,.436-.371,2.646-2.386,3.423-5.598,.053-.219-.047-.446-.244-.555Zm-3.52,5.111c-.636-.605-2.063-2.152-2.688-4.344,.528-.259,1.614-.717,2.697-.722,1.071,.028,2.144,.416,2.68,.66-.646,2.229-2.023,3.763-2.689,4.405Z"
							/>
						</g>
					</svg>
				</IconButton>
			{/if}
			{#if audioPlayer.trackId === track.id}
				<div class="equalizer-icon__container -mr-1 lg:mr-1 flex h-10 w-10 items-center justify-center">
					<div class="equalizer-icon relative" style="width: 14px; height: 14px;">
						<div
							class="equalizer-icon__bar origin-bottom transition-transform"
							style="left: 0px; transition-duration: 393.931ms; transform: scaleY(0.907575);"
						></div>
						<div
							class="equalizer-icon__bar origin-bottom transition-transform"
							style="left: 5px; transition-duration: 469.32ms; transform: scaleY(0.421268);"
						></div>
						<div
							class="equalizer-icon__bar origin-bottom transition-transform"
							style="left: 10px; transition-duration: 324.281ms; transform: scaleY(0.50507);"
						></div>
					</div>
				</div>
			{:else}
				<IconButton onclick={() => selectSongHandler(track.file)} label="Play" class="-mr-2 lg:mr-0">
					<svg
						class="play-icon"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
						width="100%"
						height="100%"
						fill="currentColor"
					>
						<path
							d="m13.249 8.897c-2.553-1.531-4.097-1.873-4.161-1.886-.254-.055-.502.092-.58.335-.021.064-.508 1.61-.508 4.653s.486 4.589.508 4.653c.078.245.335.39.58.335.064-.014 1.608-.355 4.161-1.886 2.447-1.467 3.514-2.644 3.627-2.772.165-.189.165-.471 0-.66-.113-.129-1.18-1.305-3.627-2.772zm-.514 5.348c-1.603.961-2.783 1.426-3.393 1.629-.136-.644-.343-1.941-.343-3.874s.207-3.23.343-3.874c.609.203 1.79.668 3.393 1.629 1.624.974 2.6 1.807 3.062 2.245-.463.438-1.438 1.271-3.062 2.245zm-.735-13.245c-7.813 0-11 3.187-11 11s3.187 11 11 11 11-3.187 11-11-3.187-11-11-11zm0 21c-7.196 0-10-2.804-10-10s2.804-10 10-10 10 2.804 10 10-2.804 10-10 10z"
						/>
					</svg>
				</IconButton>
			{/if}
		</li>
	{/each}
</ul>

<style>
	.desktop-track {
		background-color: rgba(255, 255, 255, 0.1);
		margin: 2px 0;
	}
	.desktop-track:hover {
		background-color: rgba(255, 255, 255, 0.4);
	}

  @keyframes equalizer-bar-1 {
    0% { transform: scaleY(0.2); }
    50% { transform: scaleY(1); }
    100% { transform: scaleY(0.4); }
  }

  @keyframes equalizer-bar-2 {
    0% { transform: scaleY(0.3); }
    50% { transform: scaleY(0.8); }
    100% { transform: scaleY(0.5); }
  }

  @keyframes equalizer-bar-3 {
    0% { transform: scaleY(0.4); }
    50% { transform: scaleY(1); }
    100% { transform: scaleY(0.2); }
  }

  .equalizer-icon__bar {
    position: absolute;
    height: 100%;
    width: 3px;
    background-color: black;
    transform-origin: bottom;
  }

  .equalizer-icon__bar:nth-child(1) {
    animation: equalizer-bar-1 500ms ease-in-out infinite;
  }

  .equalizer-icon__bar:nth-child(2) {
    animation: equalizer-bar-2 700ms ease-in-out infinite;
  }

  .equalizer-icon__bar:nth-child(3) {
    animation: equalizer-bar-3 600ms ease-in-out infinite;
  }
</style>
