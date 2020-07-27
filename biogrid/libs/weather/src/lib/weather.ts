import { SunlightIntensity, CloudCoverage } from '@biogrid/grid-simulator';
import fetch from 'node-fetch';

// TODO put api keys into their own lib
// eslint-disable-next-line @typescript-eslint/no-var-requires
const apiKey = require('./api-key.json');

interface WeatherHour {
  cloudCoverage: CloudCoverage;
  isDay: boolean;
}
interface WeatherHourMap {
  [formattedDate: string]: WeatherHour;
}

export class WeatherLib {
  private day: Date;
  private longitude: number;
  private latitude: number;
  private weatherData: WeatherHourMap;
  private setupOccured: boolean;

  constructor(day: Date, longitude: number, latitude: number) {
    this.day = day;
    this.longitude = longitude;
    this.latitude = latitude;
    this.weatherData = {};
    this.setupOccured = false;
  }
  async setup() {
    const url = `http://api.weatherapi.com/v1/history.json?key=${
      apiKey.weatherapi
    }&q=${this.latitude},${this.longitude}&dt=${this.formatDate(this.day)}`;

    const ret = await fetch(url);
    const body = await ret.json();
    this.weatherData = body.forecast.forecastday[0].hour
      .map((period: any, ) => {
        return {
          time: this.formatDateWithHour(new Date(period.time)),
          cloudCoverage: period.cloud / 100,
          isDay: period.is_day === 1,
        };
      })
      .reduce((map: WeatherHourMap, obj: WeatherHour & { time: string }) => {
        map[obj.time] = {
          cloudCoverage: obj.cloudCoverage,
          isDay: obj.isDay,
        };
        return map;
      }, {});

        this.setupOccured = true;
  }

  isSetup() {
    return this.setupOccured;
  }

  getCloudCoverage(date: Date): CloudCoverage {
    const dateFormatted = this.formatDateWithHour(date);
    if (!this.weatherData[dateFormatted]) {
      throw new Error(`Date ${dateFormatted} not found within the specified time range`);
    }
    return this.weatherData[dateFormatted].cloudCoverage;
  }

  isDay(date: Date): boolean {
    const dateFormatted = this.formatDateWithHour(date);
        if (!this.weatherData[dateFormatted]) {
      throw new Error(`Date ${dateFormatted} not found within the specified time range`);
    }
    return this.weatherData[dateFormatted].isDay;
  }

  private formatDateWithHour(date: Date): string {
    return `${this.formatDate(date)}:${date.getHours()}`;
  }

  private formatDate(date: Date): string {
    let d = new Date(date),
      month = `${(d.getMonth() + 1)}`,
      day = `${d.getDate()}`,
      year = d.getFullYear();

    if (month.length < 2) month = `0${month}`;
    if (day.length < 2) day = `0${day}`;

    return [year, month, day].join('-');
  }
}
