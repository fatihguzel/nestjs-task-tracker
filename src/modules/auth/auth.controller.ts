import {
  Controller,
  Post,
  Body,
  Req,
  UnauthorizedException,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../users/user.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiPaginationQuery } from 'nestjs-paginate';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Kullanıcı kaydı oluştur' })
  @ApiResponse({
    status: 201,
    description: 'Kullanıcı oluşturuldu',
  })
  async register(@Body() body: RegisterDto) {
    const user = await this.userService.create(
      body.username,
      body.password,
      body.passwordConfirmation,
    );
    return { id: user.id, username: user.username };
  }

  @Post('login')
  @ApiOperation({ summary: 'Kullanıcı girişi yap' })
  @ApiResponse({
    status: 200,
    description: 'Kullanıcı girişi başarılı',
  })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Geçersiz kullanıcı adı veya şifre');
    }

    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth() // Bu endpoint için JWT kimlik doğrulaması gerektirdiğini belirtiyoruz
  @ApiOperation({ summary: 'Kullanıcı profilini getir' })
  @ApiResponse({
    status: 200,
    description: 'Kullanıcı profili getirildi',
  })
  getProfile(@Req() req) {
    return req.user;
  }
}