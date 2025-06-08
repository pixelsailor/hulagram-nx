<script lang="ts">
	import { getContext } from 'svelte';
	import { fly } from 'svelte/transition';

  import type { Playlist } from './+page';
	import Tracklist from './Tracklist.svelte';

  let { playlist, showPlaylist = $bindable() }: { playlist: Playlist, showPlaylist: boolean } = $props();

  let vp: { w: () => number, h: () => number, isDesktop: () => boolean} = getContext('viewport');
</script>

<article class="card rounded-t-xl shadow grow w-full flex flex-col overflow-hidden max-w-2xl mx-auto" style:background="rgba(255,255,255,0.7)" transition:fly={{y: vp.h()}}>
  <button class="card__handle w-full h-5" onclick={() => showPlaylist = !showPlaylist}>
    <span
      class="card__handle__line block mx-auto bg-black my-2 w-8 h-1 rounded opacity-50 overflow-hidden"
      role="presentation"
    ></span>
    <span class="sr-only">Resize</span>
  </button>
  <header class="card__header mx-4 my-2">
    <h1 class="playlist__title">{@html playlist.title}</h1>
    <div class="playlist__meta flex h-12 items-center">
      <p class="playlist__artist text-sm">{@html playlist.artistName}</p>
    </div>
  </header>
  <main class="playlist__content h-full pb-4 overflow-y-auto overscroll-contain">
    <Tracklist playlist={playlist} isDesktop={vp.isDesktop()} />
  </main>
</article>