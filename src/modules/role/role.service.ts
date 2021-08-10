import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { RoleRepository } from './entities/role.repository';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleRepository)
    private readonly _roleRepository: RoleRepository,
  ) {}

  async create(role: Role): Promise<Role> {
    const savedRole: Role = await this._roleRepository.save(role);
    return savedRole;
  }

  async findAll(): Promise<Role[]> {
    const roles = await this._roleRepository.find({
      where: { status: 'ACTIVE' },
    });
    if (!roles) {
      throw new NotFoundException();
    }

    return roles;
  }

  async findOne(id: number): Promise<Role> {
    if (!id) {
      throw new BadRequestException('id must be provided');
    }

    const role = await this._roleRepository.findOne(id, {
      where: { status: 'ACTIVE' },
    });

    if (!role) {
      throw new NotFoundException();
    }

    return role;
  }

  async update(id: number, role: Role): Promise<void> {
    await this._roleRepository.update(id, role);
  }

  async remove(id: number): Promise<void> {
    const roleExists = await this._roleRepository.findOne(id, {
      where: { status: 'ACTIVE' },
    });

    if (!roleExists) {
      throw new NotFoundException();
    }

    await this._roleRepository.update(id, { status: 'INACTIVE' });
  }
}
