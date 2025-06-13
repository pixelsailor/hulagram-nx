<script lang="ts">
	import { getContext } from 'svelte';

  import type { Playlist } from '$lib/types';
	import Tracklist from './Tracklist.svelte';

  let { playlist, showPlaylist = $bindable() }: { playlist: Playlist, showPlaylist: boolean } = $props();

  let vp: { w: () => number, h: () => number, isDesktop: () => boolean} = getContext('viewport');
</script>

<article class="flex flex-col">
  <header class="card__header">
    <h1 class="playlist__title">{@html playlist.title}</h1>
    <div class="playlist__meta flex h-12 items-center">
      <p class="playlist__artist text-sm">{@html playlist.artistName}</p>
    </div>
  </header>
  <main class="playlist__content pb-4">
    <Tracklist playlist={playlist} isDesktop={vp.isDesktop()} />
  </main>
</article>