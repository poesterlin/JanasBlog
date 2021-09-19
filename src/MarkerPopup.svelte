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
  <b>Jana gibt: {data.Sterne}</b> <br>
  <div>
    <p>
      <b>Jana sagt:</b> <br>
      {@html html}
    </p>
    <a href={data.Link}>Link</a>
  </div>
</div>
