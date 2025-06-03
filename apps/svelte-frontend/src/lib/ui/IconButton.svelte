<script lang="ts">
	import { BUTTON_MIN_TARGET_HEIGHT } from "$lib/constants";

  let { onclick, children } = $props();
</script>

<button class="icon-button" style:min-width={`${BUTTON_MIN_TARGET_HEIGHT / 4}rem`} style:height={`${BUTTON_MIN_TARGET_HEIGHT / 4}rem`} onclick={onclick}>
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

  .icon-button__icon {
    display: flex;
    width: 32px;
    height: 32px;
  }
</style>