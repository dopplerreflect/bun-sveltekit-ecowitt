<script lang="ts">
	import { hueForSpeed } from '$lib/color';
	import { xyCoordinates as c, xyCoordinatesString as cs } from '$lib/geometry';
  import type { WindData } from '../../../types';

  export let windData: WindData[];
  export let svgHeight: number;

	$: mostRecent = windData[0];

	$: maxSpeed = Math.max(...windData.map((e) => e.windspeedmph));

	$: ringRadii = Array.from({ length: Math.ceil(maxSpeed) })
		.map((_, i) => {
			const div = maxSpeed > 9.9 ? 5 : 1;
			if (i % div === 0) {
				return i ;
			}
			return -1;
		})
		.filter((v) => v !== -1)
		.slice(1);

	let svg: SVGElement;

</script>
<svg bind:this={svg} xmlns="http://www.w3.org/2000/svg" height={svgHeight} viewBox="-105 -105 210 210" preserveAspectRatio="none">
	<defs>
		<mask id="ringMask">
			<path d="M-100,-100H100V100H-100Z" fill="white" />
			<path d="M0,-3H100V3.5H0Z" fill="black" />
		</mask>
		<mask id="crossRingMask">
			<path d="M-1005,-1005H1005V1005H-1005Z" fill="white" />
			<path d="M-105-3H-3V-105H3V3H105V-3H3V105H-3V3H-105Z" fill="black" />
		</mask>

		<filter id="blur">
			<feGaussianBlur in="SourceGraphic" stdDeviation="0.75" />
		</filter>
	</defs>
	<circle cx={0} cy={0} r={100} fill="oklch(0% 75% var(--hue))" />
	<g id="windrose">
		<g id="ringRadii">
			{#each ringRadii as radius}
				<text
					font-size="6px"
					y={0.75}
					x={(100 / maxSpeed) * radius}
					fill={`oklch(100% 100% ${hueForSpeed(radius)})`}
					text-anchor="middle"
					alignment-baseline="middle"
				>
					{radius}
				</text>
				<circle
					filter="url(#blur)"
					mask="url(#ringMask)"
					r={(100 / maxSpeed) * radius}
					fill="none"
					stroke={`oklch(100% 100% ${hueForSpeed(radius) })`}
				/>
				<circle
					mask="url(#ringMask)"
					r={(100 / maxSpeed) * radius}
					fill="none"
					stroke={`oklch(100% 100% ${hueForSpeed(radius) - 15})`}
					stroke-width="0.25"
				/>
			{/each}
		</g>
		<g id="windDots">
			{#each windData as rw, i}
				<circle
					cx={c(rw.winddir, rw.windspeedmph, maxSpeed).x || 0}
					cy={c(rw.winddir, rw.windspeedmph, maxSpeed).y || 0}
					r={2 - (2 / windData.length) * i}
					fill={`oklch(75% 100% ${hueForSpeed(rw.windspeedmph)})`}
				/>
			{/each}
		</g>
		<path
			id="pointer"
			filter="url(#blur)"
			d="M0,100 L-22.45139882897927,30.901699437494752 L-2.0244413695060732,2.786404500042062 A3.4441853748633044,3.4441853748633044 0 0 1 -2.024441369506074,-2.786404500042062 L-3.2756149440922124,-4.508497187473714 L0,-100 L3.275614944092212,-4.508497187473714 L2.0244413695060737,-2.786404500042062 A3.4441853748633044,3.4441853748633044 0 0 1 2.0244413695060737,2.786404500042062 L22.451398828979276,30.901699437494752 Z"
			stroke="oklch(100% 100% 60)"
			fill="none"
			stroke-width="1"
			style={`transform: rotate(${mostRecent.winddir}deg)`}
		/>
		<path
			id="pointer"
			d="M0,100 L-22.45139882897927,30.901699437494752 L-2.0244413695060732,2.786404500042062 A3.4441853748633044,3.4441853748633044 0 0 1 -2.024441369506074,-2.786404500042062 L-3.2756149440922124,-4.508497187473714 L0,-100 L3.275614944092212,-4.508497187473714 L2.0244413695060737,-2.786404500042062 A3.4441853748633044,3.4441853748633044 0 0 1 2.0244413695060737,2.786404500042062 L22.451398828979276,30.901699437494752 Z"
			stroke="oklch(100% 100% 90)"
			fill="none"
			stroke-width="0.25"
			style={`transform: rotate(${mostRecent.winddir}deg)`}
		/>
		<path
			id="pointerWindspeedNeedle"
			d={`M0,0L${cs(mostRecent.winddir, mostRecent.windspeedmph, maxSpeed)}`}
			stroke={`oklch(100% 100% ${hueForSpeed(mostRecent.windspeedmph)})`}
			stroke-width={0.5}
		/>
		<circle
			cx={0}
			cy={0}
			r={100}
			fill="none"
			stroke="white"
			filter="url(#blur)"
			mask="url(#crossRingMask)"
		/>
		<circle
			cx={0}
			cy={0}
			r={100}
			fill="none"
			stroke="white"
			stroke-width="0.25"
			mask="url(#crossRingMask)"
		/>
		{#each ['N', 'E', 'S', 'W'] as cardinal, i}
			<circle
				cx={100 * Math.cos((i * 90 - 90) * (Math.PI / 180))}
				cy={100 * Math.sin((i * 90 - 90) * (Math.PI / 180))}
				r={3}
				stroke="white"
				filter="url(#blur)"
			/>
			<circle
				cx={100 * Math.cos((i * 90 - 90) * (Math.PI / 180))}
				cy={100 * Math.sin((i * 90 - 90) * (Math.PI / 180))}
				r={3}
				stroke="white"
				stroke-width={0.25}
			/>
			<text
				x={100 * Math.cos((i * 90 - 90) * (Math.PI / 180))}
				y={100 * Math.sin((i * 90 - 90) * (Math.PI / 180))}
				class="cardinal"
				alignment-baseline="middle"
				text-anchor="middle">{cardinal}</text
			>
		{/each}
	</g>
</svg>

<style>
  svg {
    position: absolute;
    /* height: 100%; */
    width: auto;
  }
	text.cardinal {
    font-family: 'Courier New', Courier, monospace;
		fill: white;
		font-size: 5px;
		font-weight: bold;
	}
</style>
