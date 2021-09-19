<script>
  import Map from "./Map.svelte";
  import { onMount } from "svelte";

  let loading = true;
  navigator.serviceWorker.register("service-worker.js", {
    scope: "/"
  });

  onMount(async () => {
    const reg = await navigator.serviceWorker.ready;
    console.log("ready", reg);
    loading = false;
  });

</script>

{#if loading}
  <h1>loading...</h1>
{:else}
  <Map />
{/if}
