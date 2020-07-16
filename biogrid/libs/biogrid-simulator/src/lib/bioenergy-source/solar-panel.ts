import { getSunlight } from '@biogrid/weather';
import {EnergySource} from './bioenergy-source'
import {
  Validatable,
  validate,
  Power,
  SunlightIntensity,
} from '@biogrid/grid-simulator';

export class SolarPanel extends EnergySource {
  private sizeSqMtr: number;

  constructor(sizeSqMtr: number, efficiency = 0.175, longitude = 0, latitude = 0) {
    super(efficiency, longitude, latitude);
    if (!this.validateInputsSolarPanel(sizeSqMtr)) {
      throw new Error(
        `Cannot create a solar panel object with values of area ${sizeSqMtr}`
      );
    }
    this.sizeSqMtr = sizeSqMtr;
  }

  private validateInputsSolarPanel(area: number) {
    const validator: Validatable = {
      value: area,
      isPositive: area >= 0,
    };
    return validate(validator);
  }

  getPowerAmount(date: Date): Power {
    const intensity = getSunlight(date, this.longitude, this.latitude);
    const powerPerArea = this.intensityToKiloWattsPerSquareMeter(intensity);
    return powerPerArea * this.sizeSqMtr * this.efficiency;
  }

  private intensityToKiloWattsPerSquareMeter(intensity: SunlightIntensity) {
    // Calculation derived from https://www.researchgate.net/post/Howto_convert_solar_intensity_in_LUX_to_watt_per_meter_square_for_sunlight
    return 0.0079 * intensity;
  }
}
