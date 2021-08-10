import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { Role } from './entities/role.entity';
import { RoleService } from './role.service';

@Controller('roles')
export class RoleController {
  constructor(private readonly _roleService: RoleService) {}

  @Post()
  async create(@Body() role: Role): Promise<Role> {
    const createdRole = await this._roleService.create(role);
    return createdRole;
  }

  @Get()
  async findAll(): Promise<Role[]> {
    const roles = await this._roleService.findAll();
    return roles;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Role> {
    const role = await this._roleService.findOne(id);
    return role;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() role: Role,
  ): Promise<void> {
    await this._roleService.update(id, role);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this._roleService.remove(id);
  }
}
