import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { classToPlain, plainToClass } from 'class-transformer';
import { status } from 'src/shared/entity-status.enum';
import { CreateRoleDto, ReadRoleDto, UpdateRoleDto } from './dto';
import { Role } from './entities/role.entity';
import { RoleRepository } from './entities/role.repository';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleRepository)
    private readonly _roleRepository: RoleRepository,
  ) {}

  async create(role: Partial<CreateRoleDto>): Promise<CreateRoleDto> {
    const savedRole: Role = await this._roleRepository.save(role);

    const roleObject = classToPlain(savedRole);

    return plainToClass(ReadRoleDto, roleObject);
  }

  async findAll(): Promise<ReadRoleDto[]> {
    const roles = await this._roleRepository.find({
      where: { status: 'ACTIVE' },
    });
    if (!roles) {
      throw new NotFoundException();
    }
    const roleObjectArray = roles.map((role) => classToPlain(role));

    return plainToClass(ReadRoleDto, roleObjectArray);
  }

  async findOne(roleId: number): Promise<ReadRoleDto> {
    if (!roleId) {
      throw new BadRequestException('id must be provided');
    }

    const role = await this._roleRepository.findOne(roleId, {
      where: { status: status.ACTIVE },
    });

    if (!role) {
      throw new NotFoundException();
    }

    const roleObject = classToPlain(role);

    return plainToClass(ReadRoleDto, roleObject);
  }

  async update(
    roleId: number,
    role: Partial<UpdateRoleDto>,
  ): Promise<ReadRoleDto> {
    const foundRole: Role = await this._roleRepository.findOne(roleId, {
      where: { status: status.ACTIVE },
    });

    if (!foundRole) {
      throw new NotFoundException('This role does not exist');
    }

    foundRole.name = role.name ? role.name : foundRole.name;
    foundRole.description = role.description
      ? role.description
      : foundRole.description;

    const updatedRole = await this._roleRepository.save(foundRole);

    const roleObject = classToPlain(updatedRole);

    return plainToClass(ReadRoleDto, roleObject);
  }

  async remove(roleId: number): Promise<void> {
    const roleExists = await this._roleRepository.findOne(roleId, {
      where: { status: status.ACTIVE },
    });

    if (!roleExists) {
      throw new NotFoundException();
    }

    await this._roleRepository.update(roleId, { status: 'INACTIVE' });
  }
}
