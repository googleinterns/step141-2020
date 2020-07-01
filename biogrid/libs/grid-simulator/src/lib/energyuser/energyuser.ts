export interface EnergyUser {

  battery: unknown;
  getEnergyInJoules(): number;
  increaseEnergy(energy: number): void;
  decreaseEnergy(energy: number): void;
    
}
