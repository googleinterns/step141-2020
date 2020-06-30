export interface EnergyUsers {

  battery: unknown;
  getAmountEnergyUsed(): number;
  energyReceived(energy: number): void;
  depleteEnergy(energy: number): void;
    
}
