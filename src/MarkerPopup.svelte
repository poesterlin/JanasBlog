<script>
  import { createEventDispatcher } from "svelte";

  export let data;

  $: html = data.Rezension.replace(/\|/gm, "<br>").replace(/\n/gm, "<br>");
  $: linkHref = data.Link.replace(/"/gm, "");
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
    <a href={linkHref} target="_blank">Link</a>
  </div>
</div>
