import { SunlightIntensity } from '@biogrid/grid-simulator';
import fetch from 'node-fetch';

// TODO put api keys into their own lib
// eslint-disable-next-line @typescript-eslint/no-var-requires
const apiKey = require('./api-key.json');

export class WeatherLib {
  private day: Date;
  private longitude: number;
  private latitude: number;
  private weatherDataIcons: string[];

  constructor(day: Date, longitude: number, latitude: number) {
    this.day = day;
    this.longitude = longitude;
    this.latitude = latitude;
    this.weatherDataIcons = [];
  }
  async setup() {
    const url = `http://api.weatherapi.com/v1/history.json?key=${
      apiKey.weatherapi
    }&q=${this.latitude},${this.longitude}&dt=${this.formatDate(this.day)}`;

    const ret = await fetch(url);
    const body = await ret.json();
    console.log(JSON.stringify(body))
    console.log(
      body.forecast.forecastday[0].hour.map((period: any) => {
        return {
          time: period.time,
          condition: period.condition.text,
          isDay: period.is_day,
        };
      })
    );
  }

  getSunlight(): SunlightIntensity {
    return 10;
  }

  private formatDate(date: Date): string {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }
}
