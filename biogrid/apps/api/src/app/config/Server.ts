import express from 'express';
import * as swaggerUi from 'swagger-ui-express';
import * as bodyParser from 'body-parser';
import morgan from 'morgan';

import constants from './constants';
import { ErrorHandler } from './ErrorHandler';
import { RegisterRoutes } from '../build/routes';
import { Logger } from './Logger';
import '../controllers';

export class Server {
  public app: express.Express = express();
  private readonly port: number = constants.port;

  constructor() {
    this.app.use(this.allowCors);
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
    this.app.use(morgan('dev', { skip: () => !Logger.shouldLog }));
    RegisterRoutes(this.app);
    this.app.use(ErrorHandler.handleError);
    this.serveStaticFiles();

    // Disable linter as require statement is necessary for swagger files
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const swaggerDocument = require('../build/swagger.json');

    this.app.use(
      '/api-docs',
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument)
    );
  }

  public async listen(port: number = this.port) {
    process.on('uncaughtException', this.criticalErrorHandler);
    process.on('unhandledRejection', this.criticalErrorHandler);
    const listen = this.app.listen(this.port);
    Logger.info(
      `${constants.environment} server running on port: ${this.port}`
    );
    return listen;
  }

  /**
   * Serve the built, static frontend files for production
   */
  private serveStaticFiles() {
    const staticDir = __dirname + '/build/public';
    this.app.use(express.static(staticDir));
  }

  private criticalErrorHandler(...args: unknown[]) {
    Logger.error('Critical Error...', ...args);
    process.exit(1);
  }

  private allowCors(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): void {
    // TODO: in a later PR only specific sites will have access. For now, as we get setup, any site can have API access
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization, apikey, x-access-token'
    );
    next();
  }
}
