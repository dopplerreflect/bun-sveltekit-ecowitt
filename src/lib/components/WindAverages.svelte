<script lang="ts">
  import { hueForSpeed } from "$lib/color";
  import type { WindData } from "../../../types";

  export let windData: WindData[]

  let windAverage = Math.round(windData.map(o => o.windspeedmph).reduce((acc, windspeedmph) => acc + windspeedmph) / windData.length);
  let windMax = Math.round(Math.max(...windData.map(o => o.windspeedmph)))
  console.log({windAverage, windMax})
</script>

<div id="wrapper">

  <div class="box">
    <div class="header">AVERAGE</div>
    <svg viewBox="0 0 128 128">
      <text x="64" y="64" font-size="2em" alignment-baseline="middle" text-anchor="middle" fill={`oklch(100% 100% ${hueForSpeed(windAverage)})`}>{windAverage} mph</text>
    </svg>
  </div>
  <div class="box">
    <div class="header">MAX</div>
    <svg viewBox="0 0 128 128">
      <text x="64" y="64" font-size="2em" alignment-baseline="middle" text-anchor="middle" fill={`oklch(100% 100% ${hueForSpeed(windMax)})`}>{windMax} mph</text>
    </svg>
  </div>

</div>
<style>
  .box {
    width: calc(100% - 1em);
    margin-bottom: 1em;
    text-align: center;
    aspect-ratio: 1;
    border: 1px solid oklch(100% 100% var(--hue));
  }
  .box svg {
    height: 100%;
  }
  .header {
    height: 1em;
  }
</style>