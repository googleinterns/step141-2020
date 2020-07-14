import { Energy } from "../measurements";
import { GridItem } from '../grid-item';
export interface EnergySource extends GridItem {
  getpowerAmount(): Energy;
}
