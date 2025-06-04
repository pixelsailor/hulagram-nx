<script lang="ts">
	import Toolbar from '$lib/ui/Toolbar.svelte';
	import IconButton from '$lib/ui/IconButton.svelte';
	import type { Playlist } from '$lib/types';

  let { src, title, artist, paused = $bindable<boolean>(), playlist, showPlaylist = $bindable() } = $props();

  let playerWidth = $state();
  
  let time = $state(0);
  let duration = $state(0);

  let hasNext = $state(true);
  let currentTrackIndex = $derived((playlist as Playlist).tracks.findIndex((track) => track.file === src));
  
  let hasLyrics = $derived(!!(playlist as Playlist).tracks[currentTrackIndex].lyrics);
  let showLyrics = $state(false);

  function format(time: number) {
    if (isNaN(time)) return '--:--';

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds < 10 ? `0${seconds}`:seconds}`;
  }

  function playNext() {
    if (!playlist.tracks) return;
    const nextIndex = currentTrackIndex + 1;
    hasNext = nextIndex < playlist.tracks.length;
    if (hasNext) {
      const nextTrack = playlist.tracks[nextIndex];
      src = nextTrack.file;
      title = nextTrack.title;
      artist = nextTrack.artist;
      time = 0;
      paused = false;
    }
  }

  function toggleLyrics() {
    console.log('toggleLyrics');
    
  }

  function showCurrentPlaylist() {
    // if (playlist.databaseId !== currentPlaylist.databaseId) {
    //   playlistCtx.onSelectPlaylist(currentPlaylist);
    // } else {
    //   showPlaylist = true;
    // }
  }
</script>

<div class={['audio-player relative py-3', { paused }]} style:background-color="lime" bind:clientWidth={playerWidth}>
  <audio
    {src}
    bind:currentTime={time}
    bind:duration
    bind:paused
    onended={playNext}
  ></audio>
  <div class="audio-player__slider" onpointerdown={(e) => {
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
    <div class="progress" style="--progress: {time / duration}%; --slider-width: {playerWidth}px;"></div>
  </div>
  <Toolbar>
    <div class="audio-player__info flex-auto" onclick={showCurrentPlaylist}>
      <div class="audio-player__description w-full">
        <p class="song-title font-bold truncate">{title}</p>
        <p class="artist-name text-sm truncate">{artist}</p>
      </div>
      <p class="audio-player__time text-sm">
        <span>{format(time)}</span> / <span>{duration ? format(duration):'--:--'}</span>
      </p>
    </div>
    {#if hasLyrics}
      <IconButton onclick={toggleLyrics} disabled={!hasLyrics}>
        <svg id="lyrics-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="m20.088 2.783c-.08-.359-.352-.646-.706-.746-.15-.042-3.73-1.037-7.382-1.037s-7.231.995-7.382 1.037c-.354.1-.626.387-.706.746-.037.168-.912 4.165-.912 9.217s.875 9.049.912 9.217c.08.359.352.646.706.746.15.042 3.73 1.037 7.382 1.037s7.231-.995 7.382-1.037c.354-.1.626-.387.706-.746.037-.168.912-4.165.912-9.217s-.875-9.049-.912-9.217zm-9.088 13.217h-3c-.553 0-1-.447-1-1s.447-1 1-1h3c.553 0 1 .447 1 1s-.447 1-1 1zm5-4h-8c-.553 0-1-.447-1-1s.447-1 1-1h8c.553 0 1 .447 1 1s-.447 1-1 1zm0-4h-8c-.553 0-1-.447-1-1s.447-1 1-1h8c.553 0 1 .447 1 1s-.447 1-1 1z"/>
        </svg>
      </IconButton>
    {/if}
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
    <IconButton onclick={() => time = duration} disabled={!hasNext} class="-mr-2">
      <svg xmlns="http://www.w3.org/2000/svg" id="play-next-icon" viewBox="0 0 24 24">
        <path d="M2.858,2.194c-.325,.1-.578,.358-.67,.686-.049,.172-1.188,4.272-1.188,9.121s1.139,8.948,1.188,9.12c.093,.329,.347,.588,.674,.687,.161,.049,4.007,1.193,9.139,1.193,5.175,0,8.982-1.146,9.142-1.194,.325-.1,.578-.358,.67-.686,.049-.172,1.188-4.272,1.188-9.121s-1.139-8.948-1.188-9.12c-.093-.329-.347-.588-.674-.687-.161-.049-4.007-1.193-9.139-1.193C6.825,1,3.018,2.146,2.858,2.194ZM12.138,7.916c3.206,.776,5.225,2.982,5.604,3.425,.022,.025,.532,.586,.036,1.287-.08,.113-2.151,2.667-5.579,3.47-.426,.1-.867-.089-1.089-.466-.035-.059-.708-1.214-.961-2.626h-3.154c-.552,0-1-.448-1-1s.448-1,1-1h3.143c.231-1.396,.857-2.543,.89-2.602,.218-.394,.672-.594,1.11-.488Z"/>
      </svg>
    </IconButton>
  </Toolbar>
</div>

<style>
  svg path {
    fill: white;
  }

  .audio-player__slider {
    position: absolute;
    top: -0.25rem;
    left: 0;
    right: 0;
    height: 0.25rem;
    overflow: hidden;
    background-color: lime;
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