import type { ParsedForecastData, Sounding } from "../app";

const NORMALIZED_ALTITUDES = [
  0,
  100,
  250,
  500,
  750,
  ...[...Array(14).keys()].map(k => (k + 1) * 1000),
].map(ft => ft * 0.3048);

export const normalizedData = (soundings: Sounding[]) =>
  NORMALIZED_ALTITUDES.map(altitude =>
    findNormalizedAltitude(altitude + 0, soundings),
  ).filter(notEmpty);

/********************************************************/

function findNormalizedAltitude(
  height: number,
  altitudes: Sounding[],
): Sounding | undefined {
  for (let i = 0; i < altitudes.length; i++) {
    const altitude = altitudes[i];
    if (altitude.height > height) {
      if (!altitudes[i - 1]) return;

      const { speed, direction } = interpolateWindVectors(
        convertToInterpolatorWithHeight(altitudes[i - 1]),
        convertToInterpolatorWithHeight(altitudes[i]),
        height,
      );

      return {
        height,
        direction,
        temp: interpolate(
          height,
          {
            value: altitudes[i - 1].temp,
            point: altitudes[i - 1].height,
          },
          {
            value: altitudes[i].temp,
            point: altitudes[i].height,
          },
        ),
        speed,
        dewpt: interpolate(
          height,
          {
            value: altitudes[i - 1].dewpt,
            point: altitudes[i - 1].height,
          },
          {
            value: altitudes[i].dewpt,
            point: altitudes[i].height,
          },
        ),
        pressure: interpolate(
          height,
          {
            value: altitudes[i - 1].pressure,
            point: altitudes[i - 1].height,
          },
          {
            value: altitudes[i].pressure,
            point: altitudes[i].height,
          },
        ),
      };
    }
  }

  return altitudes[altitudes.length - 1];
}

export function convertToInterpolatorWithHeight(
  windAltitude: Sounding,
): WindVector {
  return {
    height: windAltitude.height,
    speed: windAltitude.speed,
    direction: windAltitude.direction,
  };
}

export interface WindVector {
  height: number;
  speed: number;
  direction: number;
}

export function interpolateWindVectors(
  vector1: WindVector,
  vector2: WindVector,
  height: number,
): WindVector {
  let { height: height1, speed: speed1, direction: direction1 } = vector1;
  let { height: height2, speed: speed2, direction: direction2 } = vector2;

  // Calculate the interpolation factor
  const factor = (height - height1) / (height2 - height1);

  // Interpolate direction
  let angularDifference = direction2 - direction1;
  if (angularDifference > 180) {
    angularDifference -= 360;
  } else if (angularDifference < -180) {
    angularDifference += 360;
  }

  if (Math.abs(angularDifference) <= 180) {
  } else {
    if (direction2 > direction1) {
      direction2 -= 360;
    } else {
      direction1 -= 360;
    }
  }

  // Calculate interpolated wind vector components
  const x1 = speed1 * Math.cos((direction1 * Math.PI) / 180);
  const y1 = speed1 * Math.sin((direction1 * Math.PI) / 180);
  const x2 = speed2 * Math.cos((direction2 * Math.PI) / 180);
  const y2 = speed2 * Math.sin((direction2 * Math.PI) / 180);
  const interpolatedX = x1 + factor * (x2 - x1);
  const interpolatedY = y1 + factor * (y2 - y1);

  // Calculate magnitude of the interpolated wind vector
  const interpolatedSpeed = Math.sqrt(
    interpolatedX * interpolatedX + interpolatedY * interpolatedY,
  );

  // Calculate direction of the interpolated wind vector
  const interpolatedVectorDirection =
    (Math.atan2(interpolatedY, interpolatedX) * 180) / Math.PI;
  const interpolatedVectorDirectionPositive =
    (interpolatedVectorDirection + 360) % 360;

  // Return the interpolated wind vector object
  return {
    height,
    speed: interpolatedSpeed,
    direction: interpolatedVectorDirectionPositive,
  };
}

interface Value {
  point: number;
  value: number;
}

export default function interpolate(
  targetPoint: number,
  ...values: Value[]
): number {
  // Sort the values array based on the point property
  values.sort((a, b) => a.point - b.point);

  // Find the two values that surround the target point
  let lowerValue: Value | undefined;
  let upperValue: Value | undefined;

  for (const value of values) {
    if (value.point <= targetPoint) {
      lowerValue = value;
    } else {
      upperValue = value;
      break;
    }
  }

  // If no upper or lower value found, return NaN
  if (!lowerValue || !upperValue) {
    return NaN;
  }

  // Perform linear interpolation
  const lowerWeight =
    (upperValue.point - targetPoint) / (upperValue.point - lowerValue.point);
  const upperWeight = 1 - lowerWeight;

  const interpolatedValue =
    lowerValue.value * lowerWeight + upperValue.value * upperWeight;
  return interpolatedValue;
}

export function notEmpty<TValue>(
  value: TValue | null | undefined,
): value is TValue {
  return value !== null && value !== undefined;
}
