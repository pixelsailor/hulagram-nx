<script lang="ts">
  import { dev } from '$app/environment';
	import { PUBLIC_DOMAIN_DEV, PUBLIC_DOMAIN_PROD } from '$env/static/public';
	import { slide } from 'svelte/transition';

  const DOMAIN = dev ? PUBLIC_DOMAIN_DEV : PUBLIC_DOMAIN_PROD;
  const RESIZE_HANDLE_HEIGHT = '40px';
  
  let { open, offset = 0, onClick, children }: { open: boolean, offset: number, onClick: () => void, children: any } = $props();

  let screenWidth = $state(0);
  let sheetWidth = $state(0);
  let xInset = $derived((screenWidth - sheetWidth) / 2);

  function handleResizeClick() {
    onClick();
  }
</script>

<div
  class={['bottomsheet__wrapper flex w-full']}
  style="--inset: {xInset}px; --offset: {offset}"
  style:max-height={open ? `calc(100vh - ${offset}px - 2rem` : '0'}
  bind:clientWidth={screenWidth}
  transition:slide
>
  <picture class="bottomsheet__bg-img absolute inset-0 -z-1 overflow-hidden">
    <img
      src={`https://${DOMAIN}app/uploads/2025/05/bg-waves__375-812-216.webp`}
      alt="Aerial view of a beach with small waves gently crashing on shore"
      role="presentation"
      class="object-left-bottom object-cover w-full h-full"
    >
  </picture>
  <div
    class={['bottomsheet flex flex-col w-full max-w-2xl mx-auto overflow-hidden rounded-t-lg shadow-md', {'': open}]}
    style:background="rgba(255,255,255,0.7)"
    bind:clientWidth={sheetWidth}
  >
    <button class="bottomsheet__handle w-full flex-none" style:height={RESIZE_HANDLE_HEIGHT} onclick={handleResizeClick}>
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
    /* flex: 1 1 100vh; */
    clip-path: inset(0 var(--inset));
  }
  .bottomsheet__wrapper--open {
    max-height: calc(100vh - var(--offset) - 2rem);
  }
</style>

