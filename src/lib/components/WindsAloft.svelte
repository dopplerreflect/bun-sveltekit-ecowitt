<script lang="ts">
  import type { ParsedForecastData } from "../../app"
	import { celsiusToFarenheit, metersToFeet, toLocalTime } from '$lib/conversions';
	import DirectionArrow from '$lib/components/DirectionArrow.svelte';
  import { browser } from '$app/environment';

	let data: ParsedForecastData;

  if(browser) {
    async function getInitialData() {
      const res = await fetch('/api/winds-aloft')
      let resJSON = await res.json();
      data = resJSON;
    }
    getInitialData();

    let cachedHour = new Date().getHours();
    function refreshOnTheHour() {
      let currentHour = new Date().getHours();
      if(new Date().getMinutes() === 0 && currentHour !== cachedHour) {
        getInitialData();
        console.log(currentHour, 'refreshed winds aloft')
        cachedHour = currentHour;
      }
    }
    const refreshInterval = setInterval(refreshOnTheHour, 1000)
  }

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
				<div class="header datetime">
          Forecast for 
					{toLocalTime(
						forecast.info.year,
						forecast.info.month,
						forecast.info.day,
						forecast.info.hour
					)}
				</div>
				<div class="header capecin">
          CAPE: {forecast.cape} CIN: {forecast.cin}
        </div>
				<div id="rows" class="grid-container inner">
          <div class="row">
            <div>ALTITUDE</div>
            <div>TEMPERATURE</div>
            <div>DIRECTION</div>
            <div>SPEED</div>
          </div>
					{#each forecast.soundings.filter( 
            (s) => (s.height < 5000)
            ) as sounding, si}
            <div class="row">
              <div class="altitude data">
                <div>
                  { metersToFeet(sounding.height)}
                </div>
                <div>
                  <small>ft</small>
                </div>
              </div>
              <div class="temperature data {highlightInversion(fi, si)}">
                <div>
                  {Math.round(celsiusToFarenheit(sounding.temp))} 
                </div>
                <div>
                <small>°F</small>
              </div>
            </div>
						<div class="direction data">
              <div>
                {sounding.direction}°
              </div>
              <div>
                <DirectionArrow style={`transform: rotate(${sounding.direction}deg`} />
              </div>
						</div>
            <div class="speed data">
              <div>
                {sounding.speed}
              </div>
              <div>
                <small>mph</small>
              </div>
            </div>
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
    height: 100%;
		font-family: 'Roboto Mono', 'Courier New', Courier, monospace;
		font-weight: bold;
		color: white;
	}
  .header.capecin {
    text-align: right;
  }
	.grid-container.outer {
    height: 100%;
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
		padding: 0.5em 0 0.5em 0;
		border-bottom: var(--border);
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
