import { BioBattery, Building, SolarPanel } from '@biogrid/biogrid-simulator';
import { Path } from 'graphlib';

export const SMALL_BATTERY = {
  DEFAULT_START_ENERGY: 13500,
  MAX_CAPACITY: 13500,
};

export const LARGE_BATTERY = {
  DEFAULT_START_ENERGY: 540000,
  MAX_CAPACITY: 540000,
};

// Each day a solar panel is roughly charged with electricity
// for 4hours at a rate of 250 watts ~ 1000watts ~~ 3.6Mj
// To prolong their life time, solar panels will be expected 
// to keep a minimum of about 10000j
export const SOLAR_PANEL = {
  DEFAULT_INITIAL_ENERGY: 3600000,
  MIN_CAPACITY: 10000,
  AREA: 10,
  KILOLUX_TO_KILOWATT_PER_SQUARE_METER: 0.0079
};

export const enum GRID_ITEM_NAMES {
  SOLAR_PANEL = 'solar_panel',
  SMALL_BATTERY = 'small_battery',
  LARGE_BATTERY = 'large_battery',
  ENERGY_USER = 'energy_user',
  GRID = 'grid',
};

export const RESISTANCE = {
  // @see https://www.cs.rochester.edu/users/faculty/nelson/courses/csc_robocon/robot_manual/wiring.html#:~:text=Gauges%20of%20AWG%2016%20and,0%2C%2000%2C%20or%20larger.
  // This value is an AWG value for power transmission lines
  // Wires used in transporting the power
  WIRE: 16,
  // @see https://en.wikipedia.org/wiki/American_wire_gauge#Tables_of_AWG_wire_sizes for these values
  RESISTANCE_16: 13.17,  // Measured in ohm/km
  // @see https://homeguides.sfgate.com/estimate-amount-wire-needed-rewire-average-home-105819.html
  // Average house requires 7.25 rolls of 50ft-roll
  // BUILDING uses wire: 13 majorly
  BUILDING: 0.726,
  // TODO get the right value for the resistance of the grid
  GRID: 0.2
}

export const BUILDING = {
  DEFAULT_INITIAL_ENERGY: 4545,
  MIN_CAPACITY: 0,
  MAX_CAPACITY: 4545,
};

export type SupplyingAgents = BioBattery | SolarPanel;

export type RecievingAgents = BioBattery[] | Building[];

export interface ShortestDistances {
  [source: string]: { [node: string]: Path };
}
