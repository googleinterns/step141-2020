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
 * Position from the top left corner of a town
 */
export interface ItemPosition {
  readonly x: Distance;
  readonly y: Distance;
}
