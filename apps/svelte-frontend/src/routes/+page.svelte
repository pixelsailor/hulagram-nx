<script lang="ts">
	import { getContext } from 'svelte';
	import { slide } from 'svelte/transition';
	import { dev } from '$app/environment';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
	import { PUBLIC_DEV_MEDIA_URL, PUBLIC_PROD_MEDIA_URL } from '$env/static/public';
	import Tracklist from './Tracklist.svelte';

  const WP_UPLOADS = dev ? PUBLIC_DEV_MEDIA_URL : PUBLIC_PROD_MEDIA_URL;

  const playlists = page.data.response.data.playlists.nodes;

  let showPlaylistCtx: any = getContext('showPlaylist');

  let vp: { w: () => number, h: () => number, isDesktop: () => boolean } = getContext('viewport');

  let playlistId = $derived(page.url.searchParams.get('playlist'));

  function selectPlaylist(id: number) {
    const params = new URLSearchParams(window.location.search);
    params.set('playlist', `${id}`);
    goto(`?${params.toString()}`, { keepFocus: true, replaceState: false, noScroll: true });
    if (!vp.isDesktop()) showPlaylistCtx.set(true);
  }

  async function downloadArchive(event: Event, file: string) {
    event.preventDefault();

    try {
      const response = await fetch(`${WP_UPLOADS}/${file}`);
      if (!response.ok) {
        throw new Error(`HTTP error. Status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = file;
      a.style.display = 'none';

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      throw error;
    }
  }
</script>

<svelte:boundary>
  <ul class="">
    {#each playlists as playlist}
      <li class="playlist py-6">
        <div class="playlist__title">
          <button type="button" class="button" onclick={() => selectPlaylist(playlist.databaseId)}>
            {@html playlist.title}
          </button>
        </div>
        {#if vp.isDesktop() && playlistId === `${playlist.databaseId}`}
          <div transition:slide>
            <div class="playlist__meta flex h-14 p-2 items-center justify-between">
              <p class="playlist__artist">{@html playlist.artistName}</p>
              <button onclick={(e) => downloadArchive(e, playlist.archive)}>Download all</button>
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