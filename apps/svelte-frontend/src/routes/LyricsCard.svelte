<script lang="ts">
	import { getContext } from 'svelte';

  let { lyrics, showLyrics = $bindable() } = $props();
  let vp: { w: () => number, h: () => number, isDesktop: () => boolean} = getContext('viewport');
</script>

<article class="flex flex-col">
  <main class="lyrics__content pb-4">
    <pre class="whitespace-pre-wrap font-sans">{@html lyrics}</pre>
  </main>
</article>
