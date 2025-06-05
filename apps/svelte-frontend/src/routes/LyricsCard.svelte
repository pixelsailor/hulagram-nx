<script lang="ts">
	import { getContext } from 'svelte';
	import { fly } from 'svelte/transition';
  import type { Playlist } from '$lib/types';

  let { lyrics, showLyrics = $bindable() } = $props();
  let vp: { w: () => number, h: () => number, offset: () => number, isDesktop: () => boolean} = getContext('viewport');
</script>

<article
  class="card rounded-t-xl shadow grow w-full flex flex-col overflow-hidden"
  style:background="rgba(255,255,255,0.7)"
  transition:fly={{y: vp.h()}}
>
  <button class="card__handle w-full h-5" onclick={() => showLyrics = !showLyrics}>
    <span
      class="card__handle__line block mx-auto bg-black my-2 w-8 h-1 rounded opacity-50 overflow-hidden"
      role="presentation"
    ></span>
    <span class="sr-only">Close lyrics</span>
  </button>
  <main class="lyrics__content h-full mt-2 p-4 overflow-y-auto overscroll-contain">
    <pre class="whitespace-pre-wrap font-sans">{@html lyrics}</pre>
  </main>
</article>
