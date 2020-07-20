import { Power } from "../measurements";
import { GridItem } from '../grid-item';

export interface EnergySourceInterface extends GridItem {
  getPowerAmount(date: Date): Power;
  getEnergyInJoules(): Power;
}
