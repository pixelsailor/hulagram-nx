<script lang="ts">
	import { BUTTON_MIN_TARGET_HEIGHT } from "$lib/constants";
	import { onMount } from "svelte";
	import type { MouseEventHandler } from "svelte/elements";

  type IconButtonProps = {
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    onClick: MouseEventHandler<HTMLButtonElement>;
    children: any;
    [x: string]: any
  }

  let { size = 'sm', onClick, children, ...props }: IconButtonProps = $props();

  let iconSize = $state<string>();

  onMount(() => {
    const sizes = {
      xs: 20,
      sm: 24,
      md: 24,
      lg: 32,
      xl: 40,
    }
    iconSize = `${sizes[size]}px`;
  });
</script>

<button
  class={['button icon-button', props.class]}
  style:min-width={`${BUTTON_MIN_TARGET_HEIGHT / 4}rem`}
  style:height={`${BUTTON_MIN_TARGET_HEIGHT / 4}rem`}
  style={props.style}
  onclick={onClick}
  disabled={props.disabled}
  title={props.title}
>
  <span class="icon-button__icon" style:width={iconSize} style:height={iconSize}>
    {@render children()}
  </span>
  {#if props.label}
    <span class="sr-only">{props.label}</span>
  {/if}
</button>

<style>
  .icon-button {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .icon-button:disabled {
    opacity: .7;
  }

  .icon-button__icon {
    display: flex;
  }
</style>