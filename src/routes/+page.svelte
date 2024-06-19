<script lang="ts">
  import { browser } from "$app/environment";
  import type { EcowittData } from "../../types";
  import initialData from "./initialData.json";
  import Windrose from "$lib/components/Windrose.svg.svelte";
  import { onMount } from "svelte";
  import WindsAloft from "$lib/components/WindsAloft.svelte";
  import WindChart from "$lib/components/WindChart.svelte";
  import WindAverages from "$lib/components/WindAverages.svelte";
  let data = initialData as EcowittData[];
  if (browser) {
    const evtSource = new EventSource("/api/sse");
    evtSource.onmessage = event => {
      data = JSON.parse(event.data).reverse();
    };
    async function getInitialData() {
      const res = await fetch("/api/data");
      let resJSON = await res.json();
      data = resJSON.reverse();
    }
    getInitialData();
  }

  $: latest = data[0] || false;
  $: windData = data.map(d => {
    let { winddir, windspeedmph, windgustmph, dateutc } = d;
    // windspeedmph = windspeedmph * 2.5; // for testing
    // windgustmph = windgustmph * 2.5;
    return { winddir, windspeedmph, windgustmph, dateutc };
  });
  // $: localtime = data[0] && new Date(data[0].dateutc).toLocaleTimeString()
  let windRoseDiv: HTMLDivElement;
  let svgHeight: number;
  onMount(() => {
    const resizeSvg = () =>
      (svgHeight = windRoseDiv.getBoundingClientRect().height);
    resizeSvg();
    window.addEventListener("resize", resizeSvg);
    return () => window.removeEventListener("resize", resizeSvg);
  });
</script>

<svelte:head>
  <title>{latest.tempf}°F</title>
</svelte:head>

<main>
  <div id="left-pane">
    <div>
      <WindAverages
        {windData}
        tempf={data[0].tempf}
      />
    </div>
  </div>
  <div
    id="windrose"
    bind:this={windRoseDiv}
  >
    <Windrose {windData} />
  </div>
  <div id="winds-aloft">
    <WindsAloft />
  </div>
  <div id="wind-chart">
    <WindChart {windData} />
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
    grid-template-columns: 1fr var(--one) var(--two);
    grid-template-rows: var(--two) var(--three);
    grid-template-areas:
      "left-pane windrose winds-aloft"
      "left-pane windrose linechart";
    background-color: oklch(12.5% 25% var(--hue));
    overflow: hidden;
  }
  #windrose {
    grid-area: windrose;
  }
  #left-pane {
    grid-area: left-pane;
  }
  #wind-chart {
    grid-area: linechart;
  }
  #winds-aloft {
    grid-area: winds-aloft;
  }
</style>
