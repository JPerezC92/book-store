import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { status } from '../../shared/entity-status.enum';
import { getConnection } from 'typeorm';
import { Role } from '../role/entities/role.entity';
import { RoleRepository } from '../role/entities/role.repository';
import { UsersDetails } from './entities/user.details.entity';
import { User } from './entities/user.entity';
import { UserRepository } from './entities/user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly _userRepository: UserRepository,
    @InjectRepository(RoleRepository)
    private readonly _roleRepository: RoleRepository,
  ) {}

  async create(user: User): Promise<User> {
    const details = new UsersDetails();
    user.details = details;

    const repo = await getConnection().getRepository(Role);

    const defaultRole = await repo.findOne({ where: { name: 'GENERAL' } });

    user.roles = [defaultRole];

    const savedUser: User = await this._userRepository.save(user);
    return savedUser;
  }

  async findAll(): Promise<User[]> {
    const users = await this._userRepository.find({
      where: { status: status.ACTIVE },
    });
    if (!users) {
      throw new NotFoundException();
    }

    return users;
  }

  async findOne(id: number): Promise<User> {
    if (!id) {
      throw new BadRequestException('id must be provided');
    }

    const user = await this._userRepository.findOne(id, {
      where: { status: status.ACTIVE },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async update(id: number, user: User): Promise<void> {
    await this._userRepository.update(id, user);
  }

  async remove(id: number): Promise<void> {
    const userExist = await this._userRepository.findOne(id, {
      where: { status: status.ACTIVE },
    });

    if (!userExist) {
      throw new NotFoundException();
    }

    await this._userRepository.update(id, { status: 'INACTIVE' });
  }

  async setRoleToUser(userId: number, roleId: number) {
    const userExist = await this._userRepository.findOne(userId, {
      where: { status: status.ACTIVE },
    });

    if (!userExist) {
      throw new NotFoundException();
    }

    const roleExist = await this._roleRepository.findOne(roleId, {
      where: { status: status.ACTIVE },
    });

    if (!roleExist) {
      throw new NotFoundException();
    }

    userExist.roles.push(roleExist);

    await this._userRepository.save(userExist);

    return true;
  }
}
