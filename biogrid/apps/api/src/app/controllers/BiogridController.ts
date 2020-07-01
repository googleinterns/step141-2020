import {
  Route,
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Security,
  Query,
  Body,
  Response,
  Tags,
  SuccessResponse,
} from 'tsoa';

import { NewBiogridBody } from '@biogrid/api-interfaces';
import { createNewBiogrid } from '../services';

@Tags('biogrid')
@Route('biogrid')
export class BiogridController extends Controller {
  constructor() {
    super();
  }

  @SuccessResponse(204)
  @Post('/')
  public async NewBioGrid(@Body() body: unknown): Promise<void> {
    await createNewBiogrid();
  }
}
