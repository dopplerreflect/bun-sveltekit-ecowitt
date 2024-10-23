<script lang="ts">
  type Props = {
    forecast: Forecast;
  };
  let { forecast }: Props = $props();
  import { hueForSpeed, hueForTemp } from "$lib/color";
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
</script>

<table class="forecast">
  <thead>
    <tr>
      <td colspan="4">
        Forecast for
        {toLocalTime(
          forecast.info.year,
          forecast.info.month,
          forecast.info.day,
          forecast.info.hour,
        )}
      </td>
    </tr>
    <tr>
      <td
        colspan="4"
        class="header capecin"
      >
        CAPE: {forecast.cape} CIN: {forecast.cin}
      </td>
    </tr>
    <tr>
      <td>Altitude</td>
      <td>Temperature</td>
      <td>Direction</td>
      <td>Speed</td>
    </tr>
  </thead>
  <tbody>
    {#each normalizedSoundings as sounding, si}
      <tr>
        <td class="altitude data">
          {Number(metersToFeet(sounding.height).toPrecision(2))}
          <small>ft</small>
        </td>
        <td
          class="temperature data {highlightInversion(si)}"
          style={`color:oklch(75% 100% ${hueForTemp(Math.round(celsiusToFarenheit(sounding.temp)))})`}
        >
          {Math.round(celsiusToFarenheit(sounding.temp))}
          <small>°F</small>
        </td>
        <td class="direction data">
          {Math.round(sounding.direction)}°
          <DirectionArrow
            style={`transform: rotate(${sounding.direction}deg`}
          />
        </td>
        <td
          class="speed data"
          style={`color: oklch(100% 100% ${hueForSpeed(Math.ceil(knotsToMph(sounding.speed)))})`}
        >
          {Math.ceil(knotsToMph(sounding.speed))}
          <small>mph</small>
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  td,
  tr {
    padding: 0;
    margin: 0;
    font-size: calc(var(--two) / 30);
    text-align: center;
  }
  tr:nth-child(odd) {
    background-color: oklch(100% 0% 270 / 0.1);
  }
  table.forecast {
    height: 100px;
    width: 100%;
    overflow: hidden;
  }
  .header.capecin {
    text-align: right;
  }
  .grid-container.inner {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .temperature.highlight {
    border-top: 1px solid oklch(50% 50% 30);
  }
  small {
    color: oklch(50% 25% 270);
  }
</style>
