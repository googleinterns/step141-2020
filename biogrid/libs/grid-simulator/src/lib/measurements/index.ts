/**
 * This files contains the names for the types of measurements and their units
 * which are are used in this project. These constants / names are used in the 
 * interfaces to highlight what kind of input or output paramater that is expected
 * 
 * @summary exports all the constants names which are synonmous for the project
 * @author Lev Stambler <levst@google.com>
 * @author Roland Naijuka <rnaijuka@google.com>
 *
 * Created at     : 6/26/2020, 3:33:10 PM
 * Last modified  : 7/28/2020, 1:41:02 PM
 */
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
 * Resistance is represented in Ohms (Ω)
 */
export type Resistance = number;

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
