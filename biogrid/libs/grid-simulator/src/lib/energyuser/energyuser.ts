export interface EnergyUser {

  battery: unknown;
  getEnergyInJoules(): number;
  addEnergy(energy: number): void;
  depleteEnergy(energy: number): void;
    
}
