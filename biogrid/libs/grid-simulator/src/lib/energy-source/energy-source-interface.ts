import { Power } from "../measurements";
export interface EnergySourceInterface {
  getPowerAmount(date: Date): Power;
}
