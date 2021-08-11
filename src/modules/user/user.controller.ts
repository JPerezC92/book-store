import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReadUserDto, UpdateUserDto } from './dto';
import { RoleType } from '../role/roleType.enum';
import { Roles } from '../role/decorators/role.decorator';
import { RoleGuard } from '../role/guards/role.guard';

@Controller('users')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @UseGuards(AuthGuard())
  @Get()
  findAll(): Promise<ReadUserDto[]> {
    return this._userService.findAll();
  }

  @Roles(RoleType.ADMINISTRATOR)
  @UseGuards(AuthGuard(), RoleGuard)
  @Get(':userId')
  findOne(@Param('userId', ParseIntPipe) userId: number): Promise<ReadUserDto> {
    return this._userService.findOne(userId);
  }

  @Patch(':userId')
  update(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ReadUserDto> {
    return this._userService.update(userId, updateUserDto);
  }

  @Delete(':userId')
  remove(@Param('userId', ParseIntPipe) userId: number): Promise<void> {
    return this._userService.remove(userId);
  }

  @Post('set-role/:userId/:roleId')
  setRoleToUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('roleId', ParseIntPipe) roleId: number,
  ): Promise<boolean> {
    return this._userService.setRoleToUser(userId, roleId);
  }
}
