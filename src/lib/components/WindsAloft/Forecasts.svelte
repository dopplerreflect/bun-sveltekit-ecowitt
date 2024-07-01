<script lang="ts">
  type Props = {
    forecast: Forecast;
  };
  let { forecast }: Props = $props();
  import {
    metersToFeet,
    celsiusToFarenheit,
    knotsToMph,
    toLocalTime,
  } from "$lib/conversions";
  import { normalizedData } from "$lib/interpolate";
  import type { Forecast } from "../../../app";
  import DirectionArrow from "../DirectionArrow.svelte";

  let normalizedSoundings = $derived(normalizedData(forecast.soundings));
  function highlightInversion(si: number): string {
    if (si > 0) {
      let curTemp = forecast.soundings[si].temp;
      let prevTemp = forecast.soundings[si - 1].temp;
      if (curTemp >= prevTemp) return "highlight";
    }
    return "";
  }
  // $effect(() => console.log(forecast));
</script>

<div class="forecast">
  <div class="header datetime">
    Forecast for
    {toLocalTime(
      forecast.info.year,
      forecast.info.month,
      forecast.info.day,
      forecast.info.hour,
    )}
  </div>
  <div class="header capecin">
    CAPE: {forecast.cape} CIN: {forecast.cin}
  </div>
  <div
    id="rows"
    class="grid-container inner"
  >
    <div class="row">
      <div>ALTITUDE</div>
      <div>TEMPERATURE</div>
      <div>DIRECTION</div>
      <div>SPEED</div>
    </div>
    {#each normalizedSoundings as sounding, si}
      <div class="row">
        <div class="altitude data">
          <div>
            {Number(metersToFeet(sounding.height).toPrecision(2))}
          </div>
          <div>
            <small>ft</small>
          </div>
        </div>
        <div class="temperature data {highlightInversion(si)}">
          <div>
            {Math.round(celsiusToFarenheit(sounding.temp))}
          </div>
          <div>
            <small>°F</small>
          </div>
        </div>
        <div class="direction data">
          <div>
            {Math.round(sounding.direction)}°
          </div>
          <div>
            <DirectionArrow
              style={`transform: rotate(${sounding.direction}deg`}
            />
          </div>
        </div>
        <div class="speed data">
          <div>
            {Math.ceil(sounding.speed)}
          </div>
          <div>
            <small>mph</small>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .header.capecin {
    text-align: right;
  }
  .grid-container.inner {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .grid-container.inner div.row {
    flex-grow: 1;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }
  .grid-container.inner div.row div {
    align-items: center;
    justify-content: center;
  }
  .forecast {
    height: calc(100% - 4em);
    width: 100%;
  }
  .forecast .header {
    /* padding: 0.5em 0 0.5em 0; */
    /* border-bottom: var(--border); */
  }
  .temperature.highlight {
    border-top: 1px solid oklch(50% 50% 30);
  }
  .forecast .data {
    display: grid;
    grid-template-columns: 1fr 1fr;
    & div {
      width: 100%;
    }
  }
  small {
    color: oklch(50% 25% var(--hue));
  }
</style>
