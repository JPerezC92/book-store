import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('/signup')
  @UsePipes(ValidationPipe)
  async signup(@Body() signupDto: SignupDto) {
    return await this._authService.signup(signupDto);
  }

  @Post('/signin')
  @UsePipes(ValidationPipe)
  async signin(@Body() signinDto: SigninDto) {
    return await this._authService.signin(signinDto);
  }
}
