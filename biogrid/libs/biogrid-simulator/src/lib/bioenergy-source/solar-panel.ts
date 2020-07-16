import { getSunlight } from '@biogrid/weather';
import {
  EnergySource,
  Validatable,
  validate,
  Power,
  SunlightIntensity,
} from '@biogrid/grid-simulator';

export class SolarPanel implements EnergySource {
  // Area in meters squared
  private area: number;
  private efficiency: number;
  private longitude: number;
  private latitude: number;

  constructor(area: number, efficiency = 0.175, longitude = 0, latitude = 0) {
    if (!this.validateInputs(area, efficiency)) {
      throw new Error(
        `Cannot create a solar panel object with values: (${area}, ${efficiency})`
      );
    }
    this.area = area;
    this.efficiency = efficiency;
    this.longitude = longitude;
    this.latitude = latitude;
  }

  private validateInputs(area: number, efficiency: number) {
    const areaValidator: Validatable = {
      value: area,
      isPositive: area >= 0,
    };
    const efficiencyValidator: Validatable = {
      value: efficiency,
      min: 0,
      max: 1,
      isPositive: efficiency >= 0,
    };
    return validate(areaValidator) && validate(efficiencyValidator);
  }

  getPowerAmount(date: Date): Power {
    const intensity = getSunlight(date, this.longitude, this.latitude);
    const powerPerArea = this.intensityToKiloWattsPerSquareMeter(intensity);
    return powerPerArea * this.area * this.efficiency;
  }

  private intensityToKiloWattsPerSquareMeter(intensity: SunlightIntensity) {
    // Calculation derived from https://www.researchgate.net/post/Howto_convert_solar_intensity_in_LUX_to_watt_per_meter_square_for_sunlight
    return 0.0079 * intensity;
  }
}
