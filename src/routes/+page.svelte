<script lang="ts">
  import { browser } from '$app/environment';
  import type { EcowittData } from '../../types'

  let data = {} as EcowittData;
  let localtime = ''
  if(browser) {
    const evtSource = new EventSource("http://localhost:3000/")
  
    evtSource.onmessage = event => {
      data = JSON.parse(event.data);
      localtime = new Date(data.dateutc).toLocaleString()
      console.log(data.dateutc, localtime)
    }

  }
</script>

<svelte:head>
  <title>{localtime}</title>
</svelte:head>

<main>

  <code>{localtime}</code>

</main>