<script lang="ts">
  import { browser } from "$app/environment";
  import type { EcowittData } from "../../types";
  import Windrose from "$lib/components/Windrose.svg.svelte";
  import WindsAloft from "$lib/components/WindsAloft.svelte";
  import WindChart from "$lib/components/WindChart.svelte";
  import WindAverages from "$lib/components/WindAverages.svelte";
  import initialData from "./initialData.json";
  let testingWindspeedBumpFactor = 1;

  let data = initialData as EcowittData[];

  if (browser) {
    const evtSource = new EventSource("/api/sse");
    evtSource.onmessage = event => {
      // console.log(event);
      data = JSON.parse(event.data).reverse();
    };
    async function getInitialData() {
      const res = await fetch("/api/data");
      let resJSON = await res.json();
      console.log(res, resJSON);
      data = resJSON.reverse();
      console.log(data);
    }
    getInitialData();
  }

  $: latest = data[0] || false;
  $: windData = data.map(d => {
    let { winddir, windspeedmph, windgustmph, dateutc } = d;
    windspeedmph = windspeedmph * testingWindspeedBumpFactor; // for testing
    windgustmph = windgustmph * testingWindspeedBumpFactor;
    return { winddir, windspeedmph, windgustmph, dateutc };
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
  <div id="windrose">
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
