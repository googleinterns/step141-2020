import { getSunlight } from '@biogrid/weather';
import { EnergySource } from './bioenergy-source';
import {
  Validatable,
  validate,
  Power,
  SunlightIntensity,
  Distance,
} from '@biogrid/grid-simulator';
import { SOLAR_PANEL } from '../config';

export class SolarPanel extends EnergySource {
  private sizeSqMtr: number;

  /**
   * @param efficiency - default to 17.5% efficiency as solar panels are often between 15% and 20% efficiency
   */
  constructor(
    x: Distance,
    y: Distance,
    sizeSqMtr: number,
    efficiency = 0.175,
    longitude = 0,
    latitude = 0
  ) {
    super(x, y, efficiency, longitude, latitude);
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
    const powerPerSqrMeter = this.intensityToKiloWattsPerSquareMeter(intensity);
    return powerPerSqrMeter * this.sizeSqMtr * this.efficiency;
  }

  private intensityToKiloWattsPerSquareMeter(intensity: SunlightIntensity) {
    // Calculation derived from https://www.researchgate.net/post/Howto_convert_solar_intensity_in_LUX_to_watt_per_meter_square_for_sunlight
    return SOLAR_PANEL.KILOLUX_TO_KILOWATT_PER_SQUARE_METER * intensity;
  }
}
