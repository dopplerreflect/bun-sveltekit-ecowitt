<script lang="ts">
  import { browser } from '$app/environment';
  import type { EcowittData } from '../../types'
  import initialData from "./initialData.json"
  import Windrose from '$lib/components/Windrose.svg.svelte';
  import { onMount } from 'svelte';
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
  let windRoseDiv: HTMLDivElement;
  let svgHeight: number;
  onMount(() => {
    const resizeSvg = () => svgHeight = windRoseDiv.getBoundingClientRect().height;
    resizeSvg();
    window.addEventListener('resize', resizeSvg)
    return () => window.removeEventListener('resize', resizeSvg)
  })
</script>

<svelte:head>
    <title>{latest.tempf}°F</title>
</svelte:head>

<main>
  <div id="windrose" bind:this={windRoseDiv}>
    <Windrose {windData} svgHeight={svgHeight}/>
      
  </div>

  <div id="left">
    <code>last report: {localtime}</code>
    
    <code>wind: {latest.winddir}° @ {latest.windspeedmph}mph gust {latest.windgustmph}mph</code>
    
    <code>temp: {latest.tempf}°F</code>
  </div>

  <div id="line-chart"><h1>line chart goes here</h1></div>

  <div id="windsaloft">
    <table>
      <caption>Winds Aloft</caption>
      <thead>
        <tr>
          <th>ALT</th>
          <th>TEMP</th>
          <th>DIR</th>
          <th>SPEED</th>
        </tr>
      </thead>
      <tbody>
      {#each [...Array(18).keys()].map(i => i) as i}
        <tr>
          <td>{i * 1000}</td>
          <td>{i * 1.5}</td>
          <td>{i * 3}</td>
          <td>{i * 4}</td>
        </tr>
      {/each}
      </tbody>
    </table>
  </div>
</main>

<style>
  :root {
    --phi: 0.618;
    --one: calc(100vh * 1);
    --two: calc(var(--one) * var(--phi));
    --three: calc(var(--one) * (var(--phi) * var(--phi)));
  }
  main {
    display: grid;
    grid-template-columns: 1fr var(--one) var(--two) 1fr;
    grid-template-rows: var(--two) var(--three);
    grid-template-areas: 
      "left windrose windsaloft right"
      "left windrose linechart right";
    background-color: oklch(12.5% 25% var(--hue));
  }
  #windrose {
    grid-area: windrose;
    border-right: 1px solid white;
  }
  #left {
    overflow: hidden;
    grid-area: left;
    border-right: 1px solid white;
  }
  #line-chart {
    grid-area: linechart;
    border-right: 1px solid white;
  }
  #windsaloft {
    grid-area: windsaloft;
    border: 1px solid white;
    border-style: none solid solid none;
  }
  code {
    display: block;
    white-space: pre;
    margin-bottom: 0.5em;
  }
  table {
    font-family: Arial, Helvetica, sans-serif;
    width: 100%;
  }
</style>