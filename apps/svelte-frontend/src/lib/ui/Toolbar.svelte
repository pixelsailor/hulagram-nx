<script lang="ts">
  import { TOOLBAR_HEIGHT } from '../constants';

  let { children } = $props();
</script>

<div class={[`cxii-toolbar min-h-${TOOLBAR_HEIGHT} w-full flex flex-nowrap items-center px-4 overflow-hidden`]}>
  {@render children()}
</div>