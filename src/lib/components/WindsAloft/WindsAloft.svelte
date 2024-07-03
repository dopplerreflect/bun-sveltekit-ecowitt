<script lang="ts">
  import type { ParsedForecastData } from "../../../app";
  import { browser } from "$app/environment";
  import Forecasts from "./Forecasts.svelte";

  let data: ParsedForecastData = $state({ alt: 0, forecasts: [] });
  let selectedIndex = $state(0);
  let forecast = $derived(data.forecasts[selectedIndex]);

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
  function selectIndex(d: number) {
    selectedIndex += d % data.forecasts.length;
  }
  $effect(() => {
    if (!data.forecasts.length) return;
  });
</script>

<main>
  {#if data && data.alt && data.forecasts}
    <div class="grid-container outer">
      <Forecasts {forecast} />
      <div class="arrows">
        <div class="left">
          {#if selectedIndex !== 0}
            <button onclick={() => selectIndex(-1)}>&lt;</button>
          {/if}
        </div>
        <div class="right">
          {#if selectedIndex !== data.forecasts.length - 1}
            <button onclick={() => selectIndex(1)}>&gt;</button>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</main>

<style>
  :root {
    --header-height: 3em;
  }
  main {
    height: 100%;
    font-family: "Roboto Mono", "Courier New", Courier, monospace;
    font-weight: bold;
    color: white;
  }
  .grid-container.outer {
    height: 100%;
    position: relative;
  }
  .arrows {
    display: none;
    font-size: 2em;
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    z-index: 1;
  }
  .grid-container.outer:hover .arrows {
    display: flex;
  }
  .arrows div {
    flex-grow: 1;
  }
  .arrows .right {
    text-align: right;
  }
  button {
    display: inline-block;
    background-color: oklch(100% 100% var(--hue) / 0.2);
    color: oklch(100% 100% var(--hue) / 0.5);
    border: none;
    width: 2em;
    height: 2em;
    font-size: 1em;
    margin: 0;
    clip-path: circle(1em at 1em 1em);
  }
</style>
