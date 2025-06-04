<script lang="ts">
	import { getContext } from 'svelte';
	import { fly } from 'svelte/transition';

  import { LIST_ITEM_PADDING, TOOLBAR_HEIGHT_PX } from '$lib/constants';
  import festival from '$lib/images/festival.mp4';
	import IconButton from '$lib/ui/IconButton.svelte';

  import type { Playlist } from './+page';

  let { playlist, showPlaylist = $bindable() }: { playlist: Playlist, showPlaylist: boolean } = $props();

  const getAudioPlayer: any = getContext('audioPlayer');
  const audioPlayer = getAudioPlayer();

  function selectSongHandler(song: any) {
    audioPlayer.onSelectSong(song, playlist);
  }

  let vp: { w: () => number, h: () => number, offset: () => number, isDesktop: () => boolean} = getContext('viewport');
</script>

<article class="card bg-black rounded-t-xl shadow text-white grow w-full" transition:fly={{y: vp.h()}}>
  <button class="card__handle w-full h-5" onclick={() => showPlaylist = !showPlaylist}>
    <span
      class="card__handle__line block mx-auto bg-white my-2 w-8 h-1 rounded opacity-50 overflow-hidden"
      role="presentation"
    ></span>
    <span class="sr-only">Resize</span>
  </button>
  <header class="card__header m-4">
    <h1 class="playlist__title">{playlist.title}</h1>
    <p class="playlist__artist">{playlist.artistName}</p>
  </header>
  <main class="playlist__content my-4">
    <ul class="playlist__tracks">
      {#each playlist.tracks as track, index}
        <li class="playlist__track flex items-center py-{LIST_ITEM_PADDING} pl-4 pr-2 gap-4">
          <div>{index + 1}.</div>
          <div class="playlist__track grow">
            <p class="playlist__track__name">{track.title}</p>
          </div>
          {#if track.downloadable}
            <IconButton onclick={() => {}}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="download-icon">
                <path d="M12,1C6.878,1,1,2.25,1,12c0,7.71,3.29,11,11,11,5.122,0,11-1.25,11-11,0-7.71-3.29-11-11-11Zm0,21c-7.103,0-10-2.897-10-10S4.897,2,12,2s10,2.897,10,10-2.897,10-10,10Z"/>
                <g>
                  <path d="M12,1C6.878,1,1,2.25,1,12c0,7.71,3.29,11,11,11,5.122,0,11-1.25,11-11,0-7.71-3.29-11-11-11Zm0,21c-7.103,0-10-2.897-10-10S4.897,2,12,2s10,2.897,10,10-2.897,10-10,10Z"/>
                  <path d="M15.517,11.466c-.064-.035-1.452-.794-3.017-.933v-3.783c0-.276-.224-.5-.5-.5s-.5,.224-.5,.5v3.788c-1.575,.159-2.964,.968-3.028,1.006-.188,.111-.283,.332-.233,.545,.8,3.415,3.339,5.47,3.45,5.552,.344,.255,.634-.01,.648-.022,.436-.371,2.646-2.386,3.423-5.598,.053-.219-.047-.446-.244-.555Zm-3.52,5.111c-.636-.605-2.063-2.152-2.688-4.344,.528-.259,1.614-.717,2.697-.722,1.071,.028,2.144,.416,2.68,.66-.646,2.229-2.023,3.763-2.689,4.405Z"/>
                </g>
              </svg>
            </IconButton>
          {/if}
          <!-- {#if audioPlayer.src === track.file}
            <video autoplay loop height="32" width="32">
              <source src={festival} type="video/mp4" />
            </video>
          {:else}
          {/if} -->
          <IconButton onclick={() => selectSongHandler(track)}>
            <svg class="play-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="currentColor">
              <path d="m13.249 8.897c-2.553-1.531-4.097-1.873-4.161-1.886-.254-.055-.502.092-.58.335-.021.064-.508 1.61-.508 4.653s.486 4.589.508 4.653c.078.245.335.39.58.335.064-.014 1.608-.355 4.161-1.886 2.447-1.467 3.514-2.644 3.627-2.772.165-.189.165-.471 0-.66-.113-.129-1.18-1.305-3.627-2.772zm-.514 5.348c-1.603.961-2.783 1.426-3.393 1.629-.136-.644-.343-1.941-.343-3.874s.207-3.23.343-3.874c.609.203 1.79.668 3.393 1.629 1.624.974 2.6 1.807 3.062 2.245-.463.438-1.438 1.271-3.062 2.245zm-.735-13.245c-7.813 0-11 3.187-11 11s3.187 11 11 11 11-3.187 11-11-3.187-11-11-11zm0 21c-7.196 0-10-2.804-10-10s2.804-10 10-10 10 2.804 10 10-2.804 10-10 10z"/>
            </svg>
          </IconButton>
        </li>
      {/each}
    </ul>
  </main>
</article>