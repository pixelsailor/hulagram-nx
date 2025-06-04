<script lang="ts">
	import { getContext } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';

  const playlists = page.data.response.data.playlists.nodes;

  let showPlaylistCtx: any = getContext('showPlaylist');

  function selectPlaylist(id: number) {
    const params = new URLSearchParams(window.location.search);
    params.set('playlist', `${id}`);
    goto(`?${params.toString()}`, { keepFocus: true, replaceState: false });
    showPlaylistCtx.set(true);
  }
</script>

<svelte:boundary>
  <ul class="">
    {#each playlists as playlist}
      <li class="playlist__title my-12">
        <button type="button" class="button" onclick={() => selectPlaylist(playlist.databaseId)}>
          {playlist.title}
        </button>
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