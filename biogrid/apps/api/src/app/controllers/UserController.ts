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
  Tags
} from 'tsoa';


@Tags('users')
@Route('users')
export class UserController extends Controller {
  constructor() {
    super();
  }

}
