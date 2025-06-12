<script lang="ts">
  import { dev } from '$app/environment';
	import { PUBLIC_DEV_MEDIA_URL, PUBLIC_PROD_MEDIA_URL } from '$env/static/public';
	import { slide } from 'svelte/transition';

  const WP_UPLOADS = dev ? PUBLIC_DEV_MEDIA_URL : PUBLIC_PROD_MEDIA_URL;
  const RESIZE_HANDLE_HEIGHT = '40px';
  
  let { open, offset = 0, onClick, children }: { open: boolean, offset: number, onClick: () => void, children: any } = $props();

  let screenWidth = $state(0);
  let sheetWidth = $state(0);
  let xInset = $derived((screenWidth - sheetWidth) / 2);

  function handleResizeClick() {
    onClick();
  }

  function handleDragStart(event: Event) {
    console.log('handleDragStart');
  }
  
  function handleDragEnd(event: DragEvent) {
    console.log('handleDragEnd');
  }
</script>

<div
  class={['bottomsheet__wrapper flex w-full', open ? 'bottomsheet__wrapper--open' : 'max-h-0']}
  style="--inset: {xInset}px; --offset: {offset}px"
  bind:clientWidth={screenWidth}
  transition:slide
>
  <picture class="bottomsheet__bg-img absolute inset-0 -z-1 overflow-hidden">
    <img
      src={`${WP_UPLOADS}/bg-waves__375-812-96.webp`}
      srcset={`${WP_UPLOADS}/bg-waves__375-812-216.webp 2x`}
      alt="Aerial view of a beach with small waves gently crashing on shore"
      role="presentation"
      class="object-left-bottom object-cover w-full h-full"
    >
  </picture>
  <div
    class={['bottomsheet flex flex-col w-full max-w-2xl mx-auto overflow-hidden rounded-t-lg shadow-md', {'bottomsheet--open': open}]}
    style:background="rgba(255,255,255,0.7)"
    bind:clientWidth={sheetWidth}
  >
    <button class="bottomsheet__handle w-full flex-none" style:height={RESIZE_HANDLE_HEIGHT} onclick={handleResizeClick} ondragstart={handleDragStart}>
      <span
        class="bottomsheet__handle__line block mx-auto bg-black my-2 w-8 h-1 rounded opacity-50 overflow-hidden"
        role="presentation"
      ></span>
      <span class="sr-only">Resize</span>
    </button>
  
    <div class="bottomsheet__content px-4 overflow-y-auto overscroll-contain" style:height="calc(100% - {RESIZE_HANDLE_HEIGHT})">
      {@render children()}
    </div>
  </div>
</div>

<style>
  .bottomsheet__wrapper {
    clip-path: inset(0 var(--inset));
  }
  .bottomsheet__wrapper--open {
    max-height: calc(100vh - var(--offset) - 2rem);
  }
</style>

