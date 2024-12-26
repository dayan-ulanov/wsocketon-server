import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto, SigninDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signup(@Body() body: SignupDto) {
    return this.authService.signup(body);
  }

  @Post('/signin')
  async signin(@Body() body: SigninDto) {
    return this.authService.signin(body);
  }
}
