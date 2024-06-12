<script lang="ts">
  import { browser } from '$app/environment';
  import type { EcowittData, RapidWind } from '../../types'
  import Windrose from '$lib/components/Windrose.svg.svelte';
  let data = [] as EcowittData[];
  let localtime = ''
  let rapid_wind: RapidWind[] = [{direction: 0, speed: 0}];  
  if(browser) {
    const evtSource = new EventSource("http://localhost:3000/")
    
    evtSource.onmessage = event => {
      data = JSON.parse(event.data);
      localtime = new Date(data[data.length - 1].dateutc).toLocaleString()
      rapid_wind = data.map((d) => ({direction: d.winddir, speed: d.windspeedmph})).reverse()
    }
  }

</script>

<svelte:head>
  <title>{localtime}</title>
</svelte:head>

<main>
  <code>last report: {localtime}</code>
  <div id="windrose">
    <Windrose {rapid_wind} />
  </div>
</main>

<style>
  main {
    height: 20px !important;
  }
  code {
    white-space: pre;
  }
</style>