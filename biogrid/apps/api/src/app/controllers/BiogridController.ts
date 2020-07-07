import {
  Route,
  Controller,
  Get,
  Post,
  Body,
  SuccessResponse,
} from 'tsoa';

import { createNewBiogrid } from '../services';

interface NewBiogridBody {
  startDate: Date
  endDate: Date,
  smallBatteryCells: number,
  largeBatteryCells: number
}


@Route('biogrid')
export class BiogridController extends Controller {
  constructor() {
    super();
  }

  @SuccessResponse(204)
  @Post('/')
  public async NewBiogrid(@Body() body: NewBiogridBody): Promise<void> {
    await createNewBiogrid();
  }
}
