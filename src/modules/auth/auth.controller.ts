import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoggedInDto } from './dto';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('/signup')
  @UsePipes(ValidationPipe)
  signup(@Body() signupDto: SignupDto) {
    return this._authService.signup(signupDto);
  }

  @Post('/signin')
  @UsePipes(ValidationPipe)
  signin(@Body() signinDto: SigninDto): Promise<LoggedInDto> {
    return this._authService.signin(signinDto);
  }
}
