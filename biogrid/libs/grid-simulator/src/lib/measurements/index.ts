/**
 * In Miles
 * Distance must be a positive number
 */
export type Distance = number;

/**
 * Energy is represents KiloJoules
 */
export type Energy = number;

/**
 * In KiloWatts
 */
export type Power = number;

/**
 * In KiloLux, which equals one thousand lumin per meter squared
 */
export type SunlightIntensity = number;

/**
 * A fraction of cloud coverage, from 0 to 1
 */
export type CloudCoverage = number;

/**
 * Position from the top left corner of a town
 */
export interface ItemPosition {
  readonly x: Distance;
  readonly y: Distance;
}
