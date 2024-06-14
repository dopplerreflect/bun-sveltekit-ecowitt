<script lang="ts">
  import { browser } from '$app/environment';
  import type { EcowittData } from '../../types'
  import Windrose from '$lib/components/Windrose.svg.svelte';
  let data = [] as EcowittData[];
  $: latest = data[0] || false;
  $: windData = data.map((d) => {
    let {winddir, windspeedmph, windgustmph} = d;
    return { winddir, windspeedmph, windgustmph }
  })
  $: localtime = data[0] && new Date(data[0].dateutc).toLocaleTimeString()
  if(browser) {
    const evtSource = new EventSource("/api/sse")
    console.log(evtSource)
    evtSource.onmessage = event => {
      data = JSON.parse(event.data).reverse();
    }
  }
</script>

<svelte:head>
  {#if latest}
    <title>{latest.tempf}°F</title>
  {/if}
</svelte:head>

<main>
  {#if latest}
  <code>last report: {localtime}

wind: {latest.winddir}° @ {latest.windspeedmph}mph gust {latest.windgustmph}mph

temp: {latest.tempf}°F
</code>
  <div id="windrose">
    <Windrose {windData} />
  </div>
  {/if}
</main>

<style>
  main {
    height: 20px !important;
  }
  code {
    display: block;
    white-space: pre;
  }
</style>