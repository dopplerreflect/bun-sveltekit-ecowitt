<script lang="ts">
  import { hueForSpeed } from "$lib/color";
  import type { WindData } from "../../../types";

  type WindChartProps = {
    windData: WindData[];
  };
  let { windData }: WindChartProps = $props();

  const height = 100;
  const width = height * 2;

  let gusts = $derived(windData.map(w => Math.round(w.windgustmph)));
  let maxSpeed = $derived(Math.max(...gusts));
  let yAxisLabels = $derived(
    [...Array(20).keys()].map(k => 5 * (k + 1)).filter(t => t < maxSpeed),
  );
  let yAxes = $derived(
    yAxisLabels.map(label => ({
      label,
      y: height - (100 / maxSpeed) * label,
    })),
  );
  let plotLineWidth = $derived(width / windData.length);

  let xAxes = $derived(
    windData
      .map(wind => {
        let dateutc = new Date(wind.dateutc);
        let hour = dateutc.getHours();
        let minute = dateutc.getMinutes().toString();
        if (minute.toString().length === 1) minute = `0${minute}`;
        let time = `${hour}:${minute}`;
        return { minute: Number(minute), time };
      })
      .map((d, i) => {
        return windData[i + 1] &&
          d.minute === new Date(windData[i + 1].dateutc).getMinutes()
          ? null
          : d.minute % 5 === 0
            ? d.time
            : null;
      }),
  );
</script>

<div>
  <svg viewBox={`0 0 ${width} ${height}`}>
    <defs>
      <linearGradient id="fade">
        <stop
          offset="50%"
          stop-color="oklch(0% 0% var(--hue) / 0.5)"
        />
        <stop
          offset="100%"
          stop-color="oklch(0% 0% var(--hue) / 0.0)"
        />
      </linearGradient>
    </defs>
    <rect
      {width}
      {height}
      fill="oklch(0% 0% var(--hue))"
    />
    {#each windData as wind, i}
      <path
        d={`M${width - plotLineWidth * (i + 1)} ${height - 100 / (maxSpeed / wind.windgustmph)}v${plotLineWidth}h${plotLineWidth}v-${plotLineWidth}Z`}
        fill={`oklch(75% 100% ${hueForSpeed(wind.windgustmph)})`}
      />
      <path
        d={`M${width - plotLineWidth * (i + 1)} ${height}v-${100 / (maxSpeed / wind.windspeedmph)}h${plotLineWidth}V${height}Z`}
        fill={`oklch(75% 100% ${hueForSpeed(wind.windspeedmph)})`}
      />
      <path
        class="hover"
        data-value={`speed: ${wind.windspeedmph}mph gust: ${windData[i].windgustmph}mph`}
        d={`M${width - plotLineWidth * (i + 1)} ${height}V0h${plotLineWidth}V${height}Z`}
        stroke-width="0.5"
        fill={`none`}
      >
        <title>
          speed: {wind.windspeedmph}mph gust: {windData[i].windgustmph}mph
        </title>
      </path>
    {/each}
    <rect
      {height}
      width="1em"
      fill="url(#fade)"
    />
    {#each yAxes as yAxis, i}
      <path
        d={`M0 ${yAxis.y}H${width}`}
        stroke={`oklch(100% 0% var(--hue) / 0.5)`}
        stroke-width={0.5}
      />
      <text
        font-family="Roboto Mono"
        font-weight="bold"
        font-size="0.5em"
        x="0"
        y={yAxis.y}
        text-anchor="left"
        alignment-baseline="middle"
        fill={`oklch(100% 0% ${hueForSpeed(yAxis.label)})`}>{yAxis.label}</text
      >
    {/each}
  </svg>
  <svg
    id="yAxes"
    viewBox={`0 0 ${width} ${(width / 2) * 0.618 ** 3}`}
  >
    <rect
      {width}
      height={width / 8.475}
      fill="oklch(0% 75% var(--hue))"
    />
    {#each xAxes as xAxis, i}
      {#if xAxis}
        <path
          d={`M${width - (width / xAxes.length) * i} 2V8`}
          stroke="white"
          stroke-width={0.25}
        />
        <text
          font-family="Roboto Mono"
          font-size="0.25em"
          x={width - (width / xAxes.length) * i}
          y="50%"
          alignment-baseline="middle"
          text-anchor="middle"
          fill="white">{xAxis}</text
        >
      {/if}
    {/each}
  </svg>
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
  }
  svg path.hover {
    pointer-events: all;
  }
  svg path.hover:hover {
    fill: oklch(100% 0% var(--hue) / 0.5);
  }
</style>
