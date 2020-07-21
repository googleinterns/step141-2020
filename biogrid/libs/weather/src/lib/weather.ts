import { SunlightIntensity } from '@biogrid/grid-simulator';
export function getSunlight(
  date: Date,
  longitude: number,
  latitude: number
): SunlightIntensity {
  // TODO have lux be determined by the time and area, see https://github.com/googleinterns/step141-2020/issues/31
  // Average amount for a clear day
  return 10;
}
