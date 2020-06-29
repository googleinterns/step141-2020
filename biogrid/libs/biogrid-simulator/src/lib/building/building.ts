import { EnergyUsers } from '@biogrid/grid-simulator';

export class Building implements EnergyUsers {

  private energyCount: number;
  battery: unknown;

  constructor(energy: number){
    this.energyCount = energy;
  }

  getAmountEnergyUsed(){
    return this.energyCount;
  }

  energyReceived(energy: number){
    this.energyCount+=energy;
  }

  depleteEnergy(energy: number){
    this.energyCount-=energy;
  }

}