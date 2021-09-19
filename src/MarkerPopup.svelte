<script>
  import { createEventDispatcher } from "svelte";

  export let data;

  $: html = data.Rezension.replace(/\|/gm, "<br>").replace(/\n/gm, "<br>");
</script>

<style>
  div {
  }
</style>

<div>
  <h1>{data.Name}</h1>
  <div>
    <b>Jana sagt:</b>
    <p>
      {@html html}
    </p>
  </div>
</div>
