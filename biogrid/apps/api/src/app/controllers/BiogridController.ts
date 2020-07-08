import { Route, Controller, Get, Post, Body, SuccessResponse } from 'tsoa';

import {
  createNewBiogrid,
  runBiogridSimulation,
  getSimulationResults,
  BiogridSimulationResults,
  NewBiogridOpts,
} from '../services';

@Route('biogrid')
export class BiogridController extends Controller {
  constructor() {
    super();
  }

  @SuccessResponse(204)
  @Post('/')
  public async NewBiogrid(@Body() body: NewBiogridOpts): Promise<void> {
    await createNewBiogrid(body);
  }

  @SuccessResponse(204)
  @Post('/run')
  public async RunBiogridSimulation(): Promise<void> {
    await runBiogridSimulation();
  }

  @SuccessResponse(200)
  @Get('/simulation-results')
  public async GetBiogridSimulationResults(): Promise<
    BiogridSimulationResults
  > {
    return await getSimulationResults();
  }
}
