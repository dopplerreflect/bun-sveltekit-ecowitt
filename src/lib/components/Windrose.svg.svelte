<script lang="ts">
	import { hueForSpeed } from '$lib/color';
	import { xyCoordinates as c, xyCoordinatesString as cs } from '$lib/geometry';
  import type { RapidWind } from '../../../types';

  export let rapid_wind: RapidWind[];

	$: mostRecent = rapid_wind[0];

	$: maxSpeed = Math.max(...rapid_wind.map((e) => e.speed));

	$: ringRadii = Array.from({ length: Math.ceil(maxSpeed) })
		.map((_, i) => {
			const div = maxSpeed > 9.9 ? 5 : 1;
			if (i % div === 0) {
				return i;
			}
			return -1;
		})
		.filter((v) => v !== -1)
		.slice(1);

	let svg: SVGElement;

</script>
<svg bind:this={svg} xmlns="http://www.w3.org/2000/svg" viewBox="-105 -105 210 210">
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
	<circle cx={0} cy={0} r={100} fill="hsl(240, 100%, 10%)" />
	<g id="windrose">
		<g id="ringRadii">
			{#each ringRadii as radius}
				<text
					font-size="6px"
					y={0.75}
					x={(100 / maxSpeed) * radius}
					fill={`hsl(${hueForSpeed(radius)}, 100%, 50%)`}
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
					stroke={`hsl(${hueForSpeed(radius)}, 100%, 50%)`}
				/>
				<circle
					mask="url(#ringMask)"
					r={(100 / maxSpeed) * radius}
					fill="none"
					stroke={`hsl(${hueForSpeed(radius) - 30}, 100%, 50%)`}
					stroke-width="0.25"
				/>
			{/each}
		</g>
		<g id="windDots">
			{#each rapid_wind as rw, i}
				<circle
					cx={c(rw.direction, rw.speed, maxSpeed).x || 0}
					cy={c(rw.direction, rw.speed, maxSpeed).y || 0}
					r={1}
					fill={`hsla(${hueForSpeed(rw.speed)}, 100%, 50%, ${
						1 - (1 / rapid_wind.length) * i
					})`}
				/>
			{/each}
		</g>
		<path
			id="pointer"
			filter="url(#blur)"
			d="M0,100 L-22.45139882897927,30.901699437494752 L-2.0244413695060732,2.786404500042062 A3.4441853748633044,3.4441853748633044 0 0 1 -2.024441369506074,-2.786404500042062 L-3.2756149440922124,-4.508497187473714 L0,-100 L3.275614944092212,-4.508497187473714 L2.0244413695060737,-2.786404500042062 A3.4441853748633044,3.4441853748633044 0 0 1 2.0244413695060737,2.786404500042062 L22.451398828979276,30.901699437494752 Z"
			stroke="hsl(30, 100%, 50%)"
			fill="none"
			stroke-width="1"
			style={`transform: rotate(${mostRecent.direction}deg)`}
		/>
		<path
			id="pointer"
			d="M0,100 L-22.45139882897927,30.901699437494752 L-2.0244413695060732,2.786404500042062 A3.4441853748633044,3.4441853748633044 0 0 1 -2.024441369506074,-2.786404500042062 L-3.2756149440922124,-4.508497187473714 L0,-100 L3.275614944092212,-4.508497187473714 L2.0244413695060737,-2.786404500042062 A3.4441853748633044,3.4441853748633044 0 0 1 2.0244413695060737,2.786404500042062 L22.451398828979276,30.901699437494752 Z"
			stroke="hsl(45, 100%, 50%)"
			fill="none"
			stroke-width="0.25"
			style={`transform: rotate(${mostRecent.direction}deg)`}
		/>
		<path
			id="pointerWindspeedNeedle"
			d={`M0,0L${cs(mostRecent.direction, mostRecent.speed, maxSpeed)}`}
			stroke={`hsl(${hueForSpeed(mostRecent.speed)}, 100%, 50%)`}
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
    top: 0;
    width: 100vmin;
    height: auto;
  }
	text.cardinal {
		fill: white;
		font-size: 5px;
		font-weight: bold;
	}
</style>