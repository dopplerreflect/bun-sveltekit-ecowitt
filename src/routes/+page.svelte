<script lang="ts">
  import { browser } from '$app/environment';
  import type { EcowittData, RapidWind } from '../../types'
  import Windrose from '$lib/components/Windrose.svg.svelte';
  let data = [] as EcowittData[];
  let localtime = ''
  let rapid_wind: RapidWind[] = [{direction: 0, speed: 0, gust: 0}];
  let tempf: number = 0;
  $: latest = rapid_wind[0];

  if(browser) {
    const evtSource = new EventSource("http://localhost:3000/")
    
    evtSource.onmessage = event => {
      data = JSON.parse(event.data).reverse();
      localtime = new Date(data[0].dateutc).toLocaleTimeString()
      rapid_wind = data.map((d) => ({direction: d.winddir, speed: d.windspeedmph, gust: d.windgustmph}))
      tempf = data[0].tempf;
    }
  }

</script>

<svelte:head>
  <title>{localtime}</title>
</svelte:head>

<main>
  <code>last report: {localtime}

wind: {latest.direction}° @ {latest.speed}mph gust {latest.gust}mph

temp: {tempf}°F
</code>
  <div id="windrose">
    <Windrose {rapid_wind} />
  </div>
</main>

<style>
  main {
    height: 20px !important;
  }
  code {
    display: block;
    white-space: pre;
  }
</style>