export interface EnergyUser {
  getEnergyInJoules(): number;
  increaseEnergy(energy: number): void;
  decreaseEnergy(energy: number): void;
}
