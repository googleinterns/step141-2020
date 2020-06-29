export interface EnergyUsers {

  battery: unknown;
  getAmountEnergyUsed(): number;
  energyReceived(energy: number): void;
  depleteEnergy(energyAmount: number): void;
    
}