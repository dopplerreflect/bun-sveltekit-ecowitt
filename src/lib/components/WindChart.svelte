<script lang="ts">
  import { hueForSpeed } from "$lib/color";
  import type { WindData } from "../../../types";

  export let windData: WindData[];

  const height = 100;
  const width = height * 1.618;

  $: windData = windData;
  $: gusts = windData.map(w => Math.round(w.windgustmph));
  $: maxSpeed = Math.max(...gusts);
  $: yAxisLabels = [...Array(20).keys()]
    .map(k => 5 * (k + 1))
    .filter(t => t < maxSpeed);
  $: yAxes = yAxisLabels.map(label => ({
    label,
    y: height - (100 / maxSpeed) * label,
  }));
  $: plotLineWidth = width / windData.length;
  // const interval = setInterval(() => {}, 8000);
</script>

<svg viewBox={`0 0 ${width} ${height}`}>
  <rect
    {width}
    {height}
    fill="oklch(0% 75% var(--hue))"
  />
  {#each windData as wind, i}
    <path
      d={`M${width - plotLineWidth * (i + 1)} ${height}v-${100 / (maxSpeed / wind.windgustmph)}h${plotLineWidth}V${height}Z`}
      fill={`oklch(50% 100% ${hueForSpeed(wind.windgustmph)})`}
    />
    <path
      d={`M${width - plotLineWidth * (i + 1)} ${height}v-${100 / (maxSpeed / wind.windspeedmph)}h${plotLineWidth}V${height}Z`}
      fill={`oklch(75% 100% ${hueForSpeed(wind.windspeedmph)})`}
    />
  {/each}
  {#each yAxes as yAxis, i}
    <path
      d={`M${0} ${yAxis.y}H${width}`}
      stroke={`oklch(75% 100% ${hueForSpeed(yAxis.label)})`}
      stroke-width={0.5}
    />
    <text
      font-family="Roboto Mono"
      font-size="1em"
      x={0}
      y={yAxis.y}
      text-anchor="left"
      alignment-baseline="middle"
      stroke="black"
      stroke-width={0.5}
      fill={`oklch(75% 100% ${hueForSpeed(yAxis.label)})`}>{yAxis.label}</text
    >
  {/each}
</svg>

<style>
</style>
