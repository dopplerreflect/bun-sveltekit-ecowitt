<script lang="ts">
  import { hueForSpeed } from "$lib/color";
  import type { WindData } from "../../../types";

  export let windData: WindData[];
  export let tempf: number;

  $: windData = windData;
  $: windAverage = Math.round(
    windData
      .map(o => o.windspeedmph)
      .reduce((acc, windspeedmph) => acc + windspeedmph) / windData.length,
  );
  $: windMax = Math.round(Math.max(...windData.map(o => o.windspeedmph)));

  let width = 72;
  let height = 18;
  let viewBox = `0 0 ${width} ${height}`;
  let x = width / 2;
  let y = height / 2;
</script>

<div id="wrapper">
  <div class="box">
    <div class="header">SPEED mph</div>
    <svg {viewBox}>
      <rect
        {width}
        {height}
        fill="oklch(25% 25% var(--hue))"
      />
      <text
        {x}
        {y}
        font-size="12px"
        alignment-baseline="middle"
        text-anchor="middle"
        fill={`oklch(100% 100% var(--hue))`}
      >
        {windData[0].windspeedmph}
      </text>
    </svg>
  </div>
  <div class="box">
    <div class="header">DIRECTION °</div>
    <svg {viewBox}>
      <rect
        {width}
        {height}
        fill="oklch(25% 25% var(--hue))"
      />
      <text
        {x}
        {y}
        font-size="12px"
        alignment-baseline="middle"
        text-anchor="middle"
        fill={`oklch(100% 100% var(--hue))`}
      >
        {windData[0].winddir}°
      </text>
    </svg>
  </div>
  <div class="box">
    <div class="header">AVERAGE mph</div>
    <svg {viewBox}>
      <rect
        {width}
        {height}
        fill="oklch(25% 25% var(--hue))"
      />
      <text
        {x}
        {y}
        font-size="12px"
        alignment-baseline="middle"
        text-anchor="middle"
        fill={`oklch(100% 100% ${hueForSpeed(windAverage)})`}
      >
        {windAverage}
      </text>
    </svg>
  </div>
  <div class="box">
    <div class="header">MAX mph</div>
    <svg {viewBox}>
      <rect
        {width}
        {height}
        fill="oklch(25% 25% var(--hue))"
      />
      <text
        {x}
        {y}
        font-size="12px"
        alignment-baseline="middle"
        text-anchor="middle"
        fill={`oklch(100% 100% ${hueForSpeed(windMax)})`}
      >
        {windMax}
      </text>
    </svg>
  </div>
  <div class="box">
    <div class="header">TEMPERATURE °F</div>
    <svg {viewBox}>
      <rect
        {width}
        {height}
        fill="oklch(25% 25% var(--hue))"
      />
      <text
        {x}
        {y}
        font-size="12px"
        alignment-baseline="middle"
        text-anchor="middle"
        fill={`oklch(100% 100% var(--hue))`}
      >
        {tempf}°F
      </text>
    </svg>
  </div>
</div>

<style>
  #wrapper {
    display: flex;
    flex-direction: column;
  }
  .box {
    height: 100%;
    & .header {
      text-align: center;
      /* border: 1px solid oklch(100% 100% var(--hue)); */
      /* border-style: solid none solid none; */
    }
  }
  svg text {
    font-family: "Roboto Mono";
    /* font-family: 'Courier New', Courier, monospace; */
  }
</style>
