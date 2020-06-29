import { outputEnergy, typeOfEnergy } from "./energy-types-interface";

export interface energySource {
  getpowerAmount(inputEnergy: typeOfEnergy): outputEnergy;
}
