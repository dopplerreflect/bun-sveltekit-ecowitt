<script lang="ts"></script>

<table>
  <caption>Winds Aloft</caption>
  <thead>
    <tr>
      <th>ALT</th>
      <th>TEMP</th>
      <th>DIR</th>
      <th>SPEED</th>
    </tr>
  </thead>
  <tbody>
  {#each [...Array(18).keys()].map(i => i) as i}
    <tr>
      <td>{i * 1000}</td>
      <td>{i * 1.5}</td>
      <td>{i * 3}</td>
      <td>{i * 4}</td>
    </tr>
  {/each}
  </tbody>
</table>

<style>
  table {
    font-family: Arial, Helvetica, sans-serif;
    width: 100%;
  }
</style>