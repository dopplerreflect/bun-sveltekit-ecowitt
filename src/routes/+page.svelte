<script lang="ts">
  import { browser } from '$app/environment';
  import type { EcowittData } from '../../types'
  import initialData from "./initialData.json"
  import Windrose from '$lib/components/Windrose.svg.svelte';
  let data = initialData as EcowittData[];
  $: latest = data[0] || false;
  $: windData = data.map((d) => {
    let {winddir, windspeedmph, windgustmph} = d;
    // windspeedmph = windspeedmph * 5 // for testing
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
  <div id="windrose">
    <Windrose {windData} />
  </div>

  <div id="data">
    <code>last report: {localtime}</code>
    
    <code>wind: {latest.winddir}° @ {latest.windspeedmph}mph gust {latest.windgustmph}mph</code>
    
    <code>temp: {latest.tempf}°F</code>
  </div>

  <div id="line-chart"><h1>line chart goes here</h1></div>

  <div id="windsaloft">Winds Aloft</div>
</main>

<style>
  main {
    display: grid;
    grid-template-columns: 100vh calc(100vh * 0.618) 1fr;
    grid-template-rows: 1fr calc((100vh * 0.618) * 0.618);
    grid-template-areas: 
      "windrose data windsaloft"
      "windrose linechart windsaloft";
    height: 100vh;
    background-color: oklch(12.5% 25% var(--hue));
  }
  #windrose {
    grid-area: windrose;
    border-right: 1px solid white;
  }
  #data {
    grid-area: data;
    border-bottom: 1px solid white;

  }
  #line-chart {
    grid-area: linechart;
  }
  #windsaloft {
    grid-area: windsaloft;
    border-left: 1px solid white;
  }
  code {
    display: block;
    white-space: pre;
    margin-bottom: 0.5em;
  }
</style>