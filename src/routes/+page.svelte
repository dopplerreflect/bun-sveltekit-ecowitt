<script lang="ts">
  import { browser } from '$app/environment';
  import type { EcowittData } from '../../types'

  let data = {} as EcowittData;
  if(browser) {
    const evtSource = new EventSource("http://localhost:3000/")
  
    evtSource.onmessage = event => {
      data = JSON.parse(event.data);
      console.log(data.dateutc)
    }

  }
</script>

<main>

  <code>{data.dateutc}</code>

</main>