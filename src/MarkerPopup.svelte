<script>
  import { createEventDispatcher } from "svelte";

  export let data;
</script>

<style>
	div{
		
	}
</style>

<div style="width:100%;text-align:center;font-weight:600">
  <b>{data.Name}</b>
  <div>
    Jana sagt:
    <p>{data.Rezension}</p>
  </div>
</div>
