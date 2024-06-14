<script lang="ts">
  import { browser } from '$app/environment';
  import type { EcowittData } from '../../types'
  import initialData from "./initialData.json"
  import Windrose from '$lib/components/Windrose.svg.svelte';
  let data = initialData as EcowittData[];
  $: latest = data[0] || false;
  $: windData = data.map((d) => {
    let {winddir, windspeedmph, windgustmph} = d;
    return { winddir, windspeedmph, windgustmph }
  })
  $: localtime = data[0] && new Date(data[0].dateutc).toLocaleTimeString()
  if(browser) {
    const evtSource = new EventSource("/api/sse")
    evtSource.onmessage = event => {
      data = JSON.parse(event.data).reverse();
    }
    async function getInitialData() {
      const res = await fetch('/api/data')
      let resJSON = await res.json();
      data = resJSON.reverse();
    }
    getInitialData();
  }
</script>

<svelte:head>
    <title>{latest.tempf}°F</title>
</svelte:head>

<main>
  <code>last report: {localtime}</code>

  <code>wind: {latest.winddir}° @ {latest.windspeedmph}mph gust {latest.windgustmph}mph</code>

  <code>temp: {latest.tempf}°F</code>

  <div id="windrose">
    <Windrose {windData} />
  </div>
</main>

<style>
  main {
    height: 20px !important;
  }
  code {
    display: block;
    white-space: pre;
    margin-bottom: 0.5em;
  }
</style>