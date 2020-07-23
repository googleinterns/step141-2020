import { Route, Controller, Post, Body, SuccessResponse } from 'tsoa';

import {
  simulateNewBiogrid,
  BiogridSimulationResults,
  NewBiogridOpts,
} from '../services';

@Route('biogrid')
export class BiogridController extends Controller {
  constructor() {
    super();
  }

  @SuccessResponse(200)
  @Post('/simulate')
  public async SimulateNewBiogrid(@Body() body: NewBiogridOpts): Promise<BiogridSimulationResults> {
    return await simulateNewBiogrid(body);
  }
}
