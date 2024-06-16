<script lang="ts">
  import { hueForSpeed } from "$lib/color";
  import type { WindData } from "../../../types";

  export let windData: WindData[];
  export let tempf: number;

  $: windData = windData;
  $: windAverage = Math.round(windData.map(o => o.windspeedmph).reduce((acc, windspeedmph) => acc + windspeedmph) / windData.length);
  $: windMax = Math.round(Math.max(...windData.map(o => o.windspeedmph)))
</script>

<div id="wrapper">
  <div class="box">
    <div class="header">SPEED</div>
    <svg viewBox="0 0 64 24">
      <text x="32" y="12" font-size="1em" alignment-baseline="middle" text-anchor="middle" fill={`oklch(100% 100% var(--hue))`}>
        {windData[0].windspeedmph} mph
      </text>
    </svg>
  </div>
  <div class="box">
    <div class="header">DIRECTION</div>
    <svg viewBox="0 0 64 24">
      <text x="32" y="12" font-size="1em" alignment-baseline="middle" text-anchor="middle" fill={`oklch(100% 100% var(--hue))`}>
        {windData[0].winddir}°
      </text>
    </svg>
  </div>
  <div class="box">
    <div class="header">AVERAGE</div>
    <svg viewBox="0 0 64 24">
      <text x="32" y="12" font-size="1em" alignment-baseline="middle" text-anchor="middle" fill={`oklch(100% 100% ${hueForSpeed(windAverage)})`}>
        {windAverage} mph
      </text>
    </svg>
  </div>
  <div class="box">
    <div class="header">MAX</div>
    <svg viewBox="0 0 64 24">
      <text x="32" y="12" font-size="1em" alignment-baseline="middle" text-anchor="middle" fill={`oklch(100% 100% ${hueForSpeed(windMax)})`}>
        {windMax} mph
      </text>
    </svg>
  </div>
  <div class="box">
    <div class="header">TEMPERATURE</div>
    <svg viewBox="0 0 64 24">
      <text x="32" y="12" font-size="1em" alignment-baseline="middle" text-anchor="middle" fill={`oklch(100% 100% ${hueForSpeed(windMax)})`}>
        {tempf}°F 
      </text>
    </svg>
  </div>

</div>
<style>
  #wrapper {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 10px);
  }
  .box {
    height: 100%;
    & .header {
      text-align: center;
      border: 1px solid oklch(100% 100% var(--hue));
      border-style: solid none solid none;
    }
  }
</style>