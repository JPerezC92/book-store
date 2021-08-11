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
import { User } from './entities/user.entity';
import { ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../role/decorators/role.decorator';
import { RoleGuard } from '../role/guards/role.guard';

@Controller('users')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Post()
  async create(@Body() user: User): Promise<User> {
    return await this._userService.create(user);
  }

  @UseGuards(AuthGuard())
  @Get()
  async findAll(): Promise<User[]> {
    return await this._userService.findAll();
  }

  @UseGuards(AuthGuard(), RoleGuard)
  @Roles('ADMIN', 'AUTHOR')
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return await this._userService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: User,
  ): Promise<void> {
    await this._userService.update(id, user);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this._userService.remove(id);
  }

  @Post('set-role/:userId/:roleId')
  async setRoleToUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('roleId', ParseIntPipe) roleId: number,
  ) {
    return this._userService.setRoleToUser(userId, roleId);
  }
}
