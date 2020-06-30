import { Energy } from "../measurements";
export interface EnergySource {
  getpowerAmount(): Energy;
}
