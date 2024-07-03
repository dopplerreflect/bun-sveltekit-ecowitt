<script lang="ts">
  import { browser } from "$app/environment";
  import type { EcowittData } from "../../types";
  import Windrose from "$lib/components/Windrose.svg.svelte";
  import WindsAloft from "$lib/components/WindsAloft/WindsAloft.svelte";
  import WindChart from "$lib/components/WindChart.svelte";
  import WindAverages from "$lib/components/WindAverages.svelte";
  import initialData from "./initialData.json";
  let testingWindspeedBumpFactor = 1;

  let data: EcowittData[] = $state(initialData);

  let windData = $derived(
    data.map(d => {
      let { winddir, windspeedmph, windgustmph, dateutc } = d;
      windspeedmph = windspeedmph * testingWindspeedBumpFactor; // for testing
      windgustmph = windgustmph * testingWindspeedBumpFactor;
      return { winddir, windspeedmph, windgustmph, dateutc };
    }),
  );
  if (browser) {
    const evtSource = new EventSource("/api/sse");
    evtSource.onmessage = event => {
      let dataFromEventSource = JSON.parse(event.data).reverse();
      // avoid throwing errors when data would be []
      if (dataFromEventSource.length) data = dataFromEventSource;
    };
    (async function getInitialData() {
      const res = await fetch("/api/data");
      let resJSON = await res.json();
      // avoid throwing errors when data would be []
      if (resJSON.length) data = resJSON.reverse();
    })();
  }
</script>

<svelte:head>
  <title>{data[0].tempf}°F</title>
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
