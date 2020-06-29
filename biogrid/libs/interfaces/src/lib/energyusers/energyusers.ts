export interface EnergyUsers {

  battery: unknown;
  getAmountEnergyUsed(energyUser: EnergyUsers): number;
  energyReceived(energy: number): void;
  depleteEnergy(energyUser: EnergyUsers): void;
    
}