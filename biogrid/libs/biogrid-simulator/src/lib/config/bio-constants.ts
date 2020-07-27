import { BioBattery, Building, SolarPanel } from '@biogrid/biogrid-simulator';
import { Path } from 'graphlib';

/**
 * These values are for a small battery which store a maximum 48-volts 6.5kWh
 * and supply upto 3 houses per hour depending on the charge
 * These small batteries are standalone batteries which support the system that relies on solar
 * @see https://www.altenergymag.com/article/2018/04/lead-acid-batteries-for-solar-storage/28297/
 * New batteries have a capacity smaller than the maximum as default start energy
 */
export const SMALL_BATTERY = {
  DEFAULT_START_ENERGY: 4.5,
  MAX_CAPACITY: 6.5,
};

/**
 * The values are for large batteries which store a maximum of 950 kWh
 * which is approximately equal the amount of power for a building in a month
 * @see https://www.altenergymag.com/article/2018/03/california-pilots-a-new-approach-to-balancing-with-li-ion-energy-storage/28204/
 * New large batteries have a capacity smaller than the maximum implemented as default start energy
 */
export const LARGE_BATTERY = {
  DEFAULT_START_ENERGY: 600,
  MAX_CAPACITY: 950,
};

/**
 * Each day a solar panel is roughly charged with electricity
 * for 4hours at a rate of 250 watts ~ 1000watts-hours
 * Solar panels have a range which they can produce
 * These solar panels will have a minimum 240 watts-hour when the sunlight is not enough
 */
export const SOLAR_PANEL = {
  AREA: 10,
  DEFAULT_INITIAL_ENERGY: 250,
  KILOLUX_TO_KILOWATT_PER_SQUARE_METER: 0.0079,
  MIN_CAPACITY: 240,
};

export const enum GRID_ITEM_NAMES {
  GRID = 'grid',
  ENERGY_USER = 'energy_user',
  LARGE_BATTERY = 'large_battery',
  SMALL_BATTERY = 'small_battery',
  SOLAR_PANEL = 'solar_panel',
}

export const GRID_DISTANCES = {
  // The discrete unit of distance for laying items apart, both vertically and horizontally
  // So, every item is 0.2, 0.4, or 0.6, etc... km apart on the x and y plane
  INCREMENTS_KM: 0.2,
};

/**
 * Resistance of the differents components used in the grid
 * For transportation of power, wire 16 of awg is used for transmission lines
 * @see https://www.cs.rochester.edu/users/faculty/nelson/courses/csc_robocon/robot_manual/wiring.html#:~:text=Gauges%20of%20AWG%2016%20and,0%2C%2000%2C%20or%20larger.
 * The wires have a constant resistance per length
 * @see https://en.wikipedia.org/wiki/American_wire_gauge#Tables_of_AWG_wire_sizes for these values
 * The resistance is measured in ohms (Ω) unless specified otherwise
 * Buildings use majorly awg wire 13
 * @see https://homeguides.sfgate.com/estimate-amount-wire-needed-rewire-average-home-105819.html
 * Average house requires 7.25 rolls of a 50ft-roll
 * Batteries have inter resistance of about 0.7 - 1.2 Ω. In here, we are considering the average of these values
 * @see http://newport.eecs.uci.edu/~chou/pdf/chou-islped04-loadmatch.pdf
 * For small batteries we are considering the @insert value // TODO insert value
 * Solar panels have an average resistance of 3.617
 * @see http://waterheatertimer.org/Resistance-and-solar-panels.html
 */
export const RESISTANCE = {
  BUILDING: 0.726,
  // TODO get the right value for the resistance of the grid
  GRID: 0.2,
  // Average resistance
  LARGE_BATTERY: 0.95,
  // Represents the resistances of awg wire 16
  RESISTANCE_16: 13.17, // Measured in ohm/km
  // TODO insert the correct resistance for the small batteries used
  SMALL_BATTERY: 0.4,
  // TODO insert the correct resistance for the solar panels used
  SOLAR_PANEL: 3.617,
};

/**
 * A building uses approximately 1000 KWh (kilo watts hour) per month,
 * which is approximately 32KWh per day and 1.3KWh per hour
 * @see https://homeprofessionals.org/solar/average-kwh-usage-for-a-2000-sq-ft-home/#:~:text=The%20average%202%2C000%20sq.,customer%20in%20a%20residential%20unit.
 */
export const BUILDING = {
  DEFAULT_INITIAL_ENERGY: 1.3,
  MAX_CAPACITY: 1.3,
  MIN_CAPACITY: 0,
};

export type SupplyingAgents = BioBattery | SolarPanel;

export type RecievingAgents = BioBattery[] | Building[];

export interface ShortestDistances {
  [source: string]: { [node: string]: Path };
}
