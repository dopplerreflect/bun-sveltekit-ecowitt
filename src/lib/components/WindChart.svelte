<script lang="ts">
  import { hueForSpeed } from "$lib/color";
  import type { WindData } from "../../../types";

  export let windData: WindData[];

  const height = 100;
  const width = height * 1.618;

  $: windData = windData;
  $: gusts = windData.map(w => Math.round(w.windgustmph));
  $: maxSpeed = Math.max(...gusts);
  $: ticks = [...Array(20).keys()]
    .map(k => 5 * (k + 1))
    .filter(t => t < maxSpeed);
  $: bars = ticks.map(t => ({ label: t, y: height - (100 / maxSpeed) * t }));
  $: barWidth = width / windData.length;
  const interval = setInterval(() => {}, 8000);
</script>

<svg viewBox={`0 0 ${width} ${height}`}>
  <rect
    {width}
    {height}
    fill="oklch(0% 75% var(--hue))"
  />
  {#each windData as wind, i}
    <path
      d={`M${width - barWidth * (i + 1)} ${height}v-${100 / (maxSpeed / wind.windgustmph)}h${barWidth}V${height}Z`}
      fill={`oklch(33% 100% ${hueForSpeed(wind.windgustmph)})`}
    />
    <path
      d={`M${width - barWidth * (i + 1)} ${height}v-${100 / (maxSpeed / wind.windspeedmph)}h${barWidth}V${height}Z`}
      fill={`oklch(75% 100% ${hueForSpeed(wind.windspeedmph)})`}
    />
  {/each}
  {#each bars as bar, i}
    <path
      d={`M${0} ${bar.y}H${width}`}
      stroke="white"
      stroke-width={0.5}
    />
    <text
      font-size="1em"
      x={0}
      y={bar.y}
      text-anchor="left"
      alignment-baseline="middle"
      stroke="black"
      stroke-width={0.5}
      fill={`oklch(75% 100% ${hueForSpeed(bar.label)})`}>{bar.label}</text
    >
  {/each}
</svg>

<style>
</style>
