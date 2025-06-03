<script lang="ts">
	import { getContext } from 'svelte';
	import Toolbar from '$lib/ui/Toolbar.svelte';
	import IconButton from '$lib/ui/IconButton.svelte';
	import type { Playlist } from '$lib/types';
  import { currentPlaylist } from './PlaylistCard.svelte';

  let { src, title, artist, paused = $bindable<boolean>(), playlist, showPlaylist = $bindable() } = $props();
  
  let playlistCtx: any = getContext('playlist');

  let time = $state(0);
  let duration = $state(0);

  function format(time: number) {
    if (isNaN(time)) return '--:--';

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}: ${seconds < 10 ? `0${seconds}` : seconds}`;
  }

  function showCurrentPlaylist() {
    if (playlist.databaseId !== currentPlaylist.databaseId) {
      playlistCtx.onSelectPlaylist(currentPlaylist);
    } else {
      showPlaylist = true;
    }
  }
</script>

<div class={['audio-player', { paused }]} style:background-color="lime">
  <audio
    {src}
    bind:currentTime={time}
    bind:duration
    bind:paused
  ></audio>
  <div class="audio-player__slider flex flex-row w-full h-2 overflow-hidden" onpointerdown={(e) => {
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
  }}>
    <div class="progress grow" style="--progress: {time / duration}%"></div>
    <div class="progress-remaining h-full basis-full shrink"></div>
  </div>
  <Toolbar>
    <div class="audio-player__info flex-grow" onclick={showCurrentPlaylist}>
      <div class="audio-player__description">
        <p class="song-title font-bold">{title}</p>
        <p class="artist-name text-sm">{artist}</p>
      </div>
      <div class="audio-player__time text-sm">
        <span>{format(time)}</span> / <span>{duration ? format(duration) : '--:--'}</span>
      </div>
    </div>
    <IconButton onclick={() => paused = !paused}>
      {#if paused}
        <svg id="play-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <path d="m12.421 10.549c.963.57 1.65 1.077 2.106 1.451-.456.374-1.144.88-2.106 1.451-.938.556-1.702.912-2.248 1.133-.089-.597-.173-1.46-.173-2.583s.084-1.987.173-2.583c.546.221 1.31.577 2.248 1.132zm10.579 1.451c0 7.71-3.29 11-11 11s-11-3.29-11-11 3.29-11 11-11 11 3.29 11 11zm-6.253-.665c-.173-.193-1.141-1.223-3.307-2.506-2.312-1.37-3.751-1.683-3.812-1.696-.499-.106-.998.183-1.156.668-.02.059-.473 1.478-.473 4.199s.453 4.14.473 4.199c.156.489.668.774 1.156.668.061-.013 1.5-.326 3.812-1.696 2.166-1.283 3.134-2.313 3.307-2.506.337-.379.337-.951 0-1.33z"/>
        </svg>
      {:else}
        <svg id="pause-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <path d="m12 1c-7.71 0-11 3.29-11 11s3.29 11 11 11 11-3.29 11-11-3.29-11-11-11zm-1 14c0 .552-.447 1-1 1s-1-.448-1-1v-6c0-.552.447-1 1-1s1 .448 1 1zm4 0c0 .552-.447 1-1 1s-1-.448-1-1v-6c0-.552.447-1 1-1s1 .448 1 1z"/>
        </svg>
      {/if}
    </IconButton>
  </Toolbar>
</div>

<style>
  svg path {
    fill: white;
  }

  .audio-player__slider {
    background-color: lime;
  }

  .progress {
    width: calc(100 * var(--progress));
    height: 100%;
    /* background-color: teal; */
  }

  .progress-remaining {
    background-color: white;
  }
</style>