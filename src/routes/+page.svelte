<script lang="ts">
  import { browser } from '$app/environment';
  import type { EcowittData, RapidWind } from '../../types'
  import Windrose from '$lib/components/Windrose.svg.svelte';
  let data = [] as EcowittData[];
  $: latest = data[0] || false;
  $: rapid_wind = data.map((d) => ({direction: d.winddir, speed: d.windspeedmph, gust: d.windgustmph}))
  $: localtime = data[0] && new Date(data[0].dateutc).toLocaleTimeString()
  if(browser) {
    const evtSource = new EventSource("http://localhost:3000/")
    
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
    <Windrose {rapid_wind} />
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