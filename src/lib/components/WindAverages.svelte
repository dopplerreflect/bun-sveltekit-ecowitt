<script lang="ts">
  import { hueForSpeed, hueForTemp } from "$lib/color";
  import type { WindData } from "../../../types";

  type WindAverageProps = {
    windData: WindData[];
    tempf: number;
  };
  let { windData, tempf }: WindAverageProps = $props();

  let windAverage = $derived(
    Math.round(
      windData
        .map(o => o.windspeedmph)
        .reduce((acc, windspeedmph) => acc + windspeedmph) / windData.length,
    ),
  );
  let windMax = $derived(Math.max(...windData.map(o => o.windgustmph)));

  let width = 72;
  let height = 18;
  let viewBox = `0 0 ${width} ${height}`;
  let x = width / 2;
  let y = height / 2;
</script>

<div id="wrapper">
  <div class="box">
    <div class="header">TEMPERATURE °F</div>
    <div
      class="value"
      style={`color: oklch(75% 100% ${hueForTemp(tempf)})`}
    >
      {tempf.toFixed(1)}°F
    </div>
  </div>
  <div class="box">
    <div class="header">SPEED mph</div>
    <div
      class="value"
      style={`color: oklch(75% 100% ${hueForSpeed(windData[0].windspeedmph)})`}
    >
      {windData[0].windspeedmph}
    </div>
  </div>
  <div class="box">
    <div class="header">GUST mph</div>
    <div
      class="value"
      style={`color: oklch(75% 100% ${hueForSpeed(windData[0].windgustmph)})`}
    >
      {windData[0].windgustmph}
    </div>
  </div>
  <div class="box">
    <div class="header">AVERAGE mph</div>
    <div
      class="value"
      style={`color: oklch(75% 100% ${hueForSpeed(windAverage)})`}
    >
      {windAverage}
    </div>
  </div>
  <div class="box">
    <div class="header">MAX GUST mph</div>
    <div
      class="value"
      style={`color: oklch(75% 100% ${hueForSpeed(windMax)})`}
    >
      {windMax}
    </div>
  </div>
</div>

<style>
  #wrapper {
    display: flex;
    flex-direction: row;
  }
  .box {
    flex: auto;
    & .header {
      text-align: center;
    }
    & .value {
      font-size: 2em;
      text-align: center;
    }
  }
</style>
