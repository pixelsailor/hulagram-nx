<script lang="ts">
	import { BUTTON_MIN_TARGET_HEIGHT } from "$lib/constants";

  let { onClick, children, ...props } = $props();
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
  <span class="icon-button__icon">
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
    width: 32px;
    height: 32px;
  }
</style>