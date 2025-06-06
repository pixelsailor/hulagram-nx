<script lang="ts">
	import { getContext } from 'svelte';
	import { slide } from 'svelte/transition';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
	import Tracklist from './Tracklist.svelte';

  const playlists = page.data.response.data.playlists.nodes;

  let showPlaylistCtx: any = getContext('showPlaylist');

  let vp: { w: () => number, h: () => number, offset: () => number, isDesktop: () => boolean} = getContext('viewport');

  let playlistId = $derived(page.url.searchParams.get('playlist'));

  function selectPlaylist(id: number) {
    const params = new URLSearchParams(window.location.search);
    params.set('playlist', `${id}`);
    goto(`?${params.toString()}`, { keepFocus: true, replaceState: false, noScroll: true });
    if (!vp.isDesktop()) showPlaylistCtx.set(true);
  }
</script>

<svelte:boundary>
  <ul class="">
    {#each playlists as playlist}
      <li class="playlist my-12">
        <div class="playlist__title">
          <button type="button" class="button" onclick={() => selectPlaylist(playlist.databaseId)}>
            {@html playlist.title}
          </button>
        </div>
        {#if vp.isDesktop() && playlistId === `${playlist.databaseId}`}
          <div transition:slide>
            <div class="playlist__meta">
              <p class="playlist__artist">{@html playlist.artistName}</p>
              <button>Download all</button>
            </div>
            <Tracklist playlist={playlist} isDesktop={vp.isDesktop()} />
          </div>
        {/if}
      </li>
    {/each}
  </ul>
</svelte:boundary>

<style>
  .button {
    text-align: inherit;
    text-transform: inherit;
    line-height: 1;
  }
</style>