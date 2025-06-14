<script lang="ts">
  let { data } = $props();

  const { title, content } = data.page;
</script>

<div class="about-page">
  <h1 class="text-3xl">{title}</h1>
  <p>{@html content}</p>
</div>