import { Power } from "../measurements";
export interface EnergySource {
  getPowerAmount(date: Date): Power;
}
