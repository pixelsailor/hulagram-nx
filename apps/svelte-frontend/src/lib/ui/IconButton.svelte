<script lang="ts">
	import { BUTTON_MIN_TARGET_HEIGHT } from "$lib/constants";

  let { children, ...props } = $props();
</script>

<button
  class={['icon-button', props.class]}
  style:min-width={`${BUTTON_MIN_TARGET_HEIGHT / 4}rem`}
  style:height={`${BUTTON_MIN_TARGET_HEIGHT / 4}rem`}
  style={props.style}
  onclick={props.onclick}
  disabled={props.disabled}
>
  <span class="icon-button__icon">
    {@render children()}
  </span>
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