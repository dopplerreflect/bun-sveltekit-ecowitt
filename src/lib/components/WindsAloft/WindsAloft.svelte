<script lang="ts">
  import type { ParsedForecastData } from "../../../app";
  import {
    celsiusToFarenheit,
    knotsToMph,
    metersToFeet,
    toLocalTime,
  } from "$lib/conversions";
  import DirectionArrow from "$lib/components/DirectionArrow.svelte";
  import { browser } from "$app/environment";
  import { normalizedData } from "$lib/interpolate";
  import Forecasts from "./Forecasts.svelte";

  let data: ParsedForecastData = $state({ alt: 0, forecasts: [] });

  if (browser) {
    async function getInitialData() {
      const res = await fetch("/api/winds-aloft");
      let resJSON = await res.json();
      data = resJSON;
    }
    getInitialData();

    let cachedHour = new Date().getHours();
    function refreshOnTheHour() {
      let currentHour = new Date().getHours();
      if (new Date().getMinutes() === 0 && currentHour !== cachedHour) {
        getInitialData();
        console.log(currentHour, "refreshed winds aloft");
        cachedHour = currentHour;
      }
    }
    const refreshInterval = setInterval(refreshOnTheHour, 1000);
  }

  $effect(() => {
    if (!data.forecasts.length) return;
    const dd = normalizedData(data.forecasts[0].soundings);
  });
</script>

<main>
  {#if data && data.alt && data.forecasts}
    {#each data.forecasts as forecast, fi}
      <div class="grid-container outer">
        <Forecasts {forecast} />
      </div>
    {/each}
  {/if}
</main>

<style>
  :root {
    --header-height: 3em;
    /* --border: 1px solid oklch(100% 100% var(--hue)); */
  }
  main {
    height: 100%;
    font-family: "Roboto Mono", "Courier New", Courier, monospace;
    font-weight: bold;
    color: white;
    overflow: hidden;
  }
  .grid-container.outer {
    height: 100%;
  }
</style>
