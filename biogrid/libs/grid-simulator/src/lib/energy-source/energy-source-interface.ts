import { Power } from "../measurements";
import { GridItem } from '../grid-item';

export interface EnergySourceInterface extends GridItem {
  getPowerAmount(date: Date): Promise<Power>;
  getEnergyInKilowattHour(date?: Date): Promise<Power>;
}
