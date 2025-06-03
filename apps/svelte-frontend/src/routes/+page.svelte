<script lang="ts">
	import { getContext } from 'svelte';
  // import PlaylistCard from './PlaylistCard.svelte';
	import type { PlaylistContext, Playlists } from '$lib/types';
	import type { Playlist } from './+page';

  let { data } = $props();

  const playlists = data.page.data.playlists.nodes;
  // const cardOffset = '64px'; // top of the card element - margin - card handle height

  let playlistCtx: PlaylistContext = getContext('playlist');
  // let vp: { w: () => number, h: () => number, offset: () => number, isDesktop: () => boolean} = getContext('viewport');

  // let expandendCardHeight = $state(vp.h() - )

  // let selectedPlaylist = $state.raw<Playlist>();

  // let showPlaylist = $state(false);

  function selectPlaylist(playlist: Playlist) {
    playlistCtx.onSelectPlaylist(playlist)
  }

  // function showSelectedPlaylist(playlist: Playlist) {
  //   selectedPlaylist = playlist;
  //   showPlaylist = true;
  // }
</script>

<svelte:boundary>
  <ul class="">
    {#each playlists as playlist}
      <li class="playlist__title my-12">
        <button type="button" class="button" onclick={() => selectPlaylist(playlist)}>
          {playlist.title}
        </button>
      </li>
    {/each}
  </ul>
</svelte:boundary>

<!-- {#if selectedPlaylist}
  <div class="fixed left-0 right-0" style:top="100px">
    <PlaylistCard playlist={selectedPlaylist} bind:showPlaylist />
  </div>
{/if} -->

<style>
  .button {
    text-align: inherit;
    text-transform: inherit;
    line-height: 1;
  }
</style>