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
import { CreateRoleDto, ReadRoleDto, UpdateRoleDto } from './dto';
import { RoleService } from './role.service';

@Controller('roles')
export class RoleController {
  constructor(private readonly _roleService: RoleService) {}

  @Post()
  async create(
    @Body() createRoleDto: Partial<CreateRoleDto>,
  ): Promise<CreateRoleDto> {
    const createdRole = await this._roleService.create(createRoleDto);
    return createdRole;
  }

  @Get()
  findAll(): Promise<ReadRoleDto[]> {
    return this._roleService.findAll();
  }

  @Get(':roleId')
  findOne(@Param('roleId', ParseIntPipe) roleId: number): Promise<ReadRoleDto> {
    return this._roleService.findOne(roleId);
  }

  @Patch(':roleId')
  update(
    @Param('roleId', ParseIntPipe) roleId: number,
    @Body() updateRoleDto: Partial<UpdateRoleDto>,
  ): Promise<ReadRoleDto> {
    return this._roleService.update(roleId, updateRoleDto);
  }

  @Delete(':roleId')
  remove(@Param('roleId', ParseIntPipe) roleId: number): Promise<void> {
    return this._roleService.remove(roleId);
  }
}
