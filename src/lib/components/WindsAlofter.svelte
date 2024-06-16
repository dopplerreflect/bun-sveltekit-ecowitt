<script lang="ts">
  import type { ParsedForecastData } from "../../app"
	import { metersToFeet, knotsToMph, toLocalTime, celsiusToFarenheit } from '$lib/conversions';
	import DirectionArrow from '$lib/components/DirectionArrow.svelte';
  import { browser } from '$app/environment';

	export let data: ParsedForecastData;

  if(browser) {
    async function getInitialData() {
      const res = await fetch('/api/winds-aloft')
      let resJSON = await res.json();
      data = resJSON;
    }
    getInitialData();
  }

	let useFeet = true;
	let useMph = true;
	let useFarenheit = true;
	let useAGL = true; // data.alt > 0;
	let filter5km = true;

	function highlightInversion(fi: number, si: number): string {
		if (si > 0) {
			let forecast = data.forecasts[fi];
			let curTemp = forecast.soundings[si].temp;
			let prevTemp = forecast.soundings[si - 1].temp;
			if (curTemp >= prevTemp) return 'highlight';
		}
		return '';
	}
</script>

<main>
  {#if data && data.alt && data.forecasts }
    
	<div class="grid-container outer">
		{#each data.forecasts as forecast, fi}
			<div class="forecast">
				<time class="header datetime">
          Forecast for 
					{toLocalTime(
						forecast.info.year,
						forecast.info.month,
						forecast.info.day,
						forecast.info.hour
					)}
				</time>
				<div class="header capecin">CAPE: {forecast.cape} CIN: {forecast.cin}</div>
				<div class="grid-container inner">
					<div>ALTITUDE</div>
					<div>SPEED</div>
					<div>DIRECTION</div>
					<div>DIRECTION</div>
					<div>TEMPERATURE</div>
					{#each forecast.soundings.filter( (s) => (filter5km ? s.height < 5000 : s) ) as sounding, si}
						<div class="height">
							{sounding.height}
						</div>
						<div class="speed">
							{sounding.speed}
						</div>
						<div class="direction">
							<DirectionArrow style={`transform: rotate(${sounding.direction}deg`} />
						</div>
						<div class="direction">
							{sounding.direction}°
						</div>
						<div class="temperature {highlightInversion(fi, si)}">
							{Math.round(
								Number(useFarenheit ? celsiusToFarenheit(sounding.temp) : sounding.temp)
							)}°F
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>
  {/if}

</main>

<style>
  :root {
    --header-height: 3em;
		--border: 1px solid oklch(100% 100% var(--hue));
	}
	main {
		font-family: 'Courier New', Courier, monospace;
		font-weight: bold;
		color: white;
	}
  .header.capecin {
    text-align: right;
  }
	.grid-container.outer {
		display: flex;
	}
	.grid-container.inner {
    width: 100%;
    height: 100%;
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		/* padding: 0.5em 0 0.5em 0; */
	}
	.grid-container.inner div {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.forecast {
		width: 100%;
	}
	time {
		display: block;
	}
	.forecast .header {
		padding: 0.25em;
		border-bottom: var(--border);
	}
	.temperature.highlight {
		background-color: hsl(30, 100%, 33%);
	}
	code {
		display: block;
		white-space: pre;
	}
</style>
