<script lang="ts">
	import { getContext } from 'svelte';
	import { slide } from 'svelte/transition';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
	import Tracklist from './Tracklist.svelte';

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
            <div class="playlist__meta flex h-14 py-2 items-center justify-between">
              <p class="playlist__artist">{playlist.artistName}</p>
              {#if playlist.archive}
                <div class="hidden lg:inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 has-[>svg]:px-3">
                  <a href="{playlist.archive}" data-sveltekit-preload-data="tap" download>Download all</a>
                </div>
              {/if}
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