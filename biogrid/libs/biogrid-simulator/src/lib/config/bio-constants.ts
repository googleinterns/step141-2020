import { BioBattery, BioEnergySource, Building } from '@biogrid/biogrid-simulator';
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
};

export const enum GRID_ITEM_NAMES {
  SOLAR_PANEL = 'solar_panel',
  SMALL_BATTERY = 'small_battery',
  LARGE_BATTERY = 'large_battery',
  ENERGY_USER = 'energy_user',
  GRID = 'grid',
};

export const BUILDING = {
  DEFAULT_INITIAL_ENERGY: 4545,
  MIN_CAPACITY: 0,
  MAX_CAPACITY: 4545,
};

export type SupplyingAgents = BioBattery | BioEnergySource;

export type RecievingAgents = BioBattery[] | Building[];

export interface ShortestDistances {
  [source: string]: { [node: string]: Path };
}
