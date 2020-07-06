import { DefaultApi, Configuration } from '../build/';
import { environment } from '../../environments/environment';

export class Client {
  private static instance: Client;
  public api: DefaultApi;
  private constructor() {
    this.api = new DefaultApi(
      new Configuration({
        basePath: environment.basePath,
      })
    );
  }

  static getInstance(): Client {
    if (!this.instance) {
      this.instance = new Client();
    }
    return this.instance;
  }
}
