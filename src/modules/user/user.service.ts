import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { classToPlain, plainToClass } from 'class-transformer';
import { status } from '../../shared/entity-status.enum';
import { RoleRepository } from '../role/entities/role.repository';
import { ReadUserDto, UpdateUserDto } from './dto';
import { UserRepository } from './entities/user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly _userRepository: UserRepository,
    @InjectRepository(RoleRepository)
    private readonly _roleRepository: RoleRepository,
  ) {}

  async findAll(): Promise<ReadUserDto[]> {
    const users = await this._userRepository.find({
      where: { status: status.ACTIVE },
    });
    if (!users) {
      throw new NotFoundException();
    }

    const userObjectArray = users.map((user) => classToPlain(user));

    return plainToClass(ReadUserDto, userObjectArray);
  }

  async findOne(id: number): Promise<ReadUserDto> {
    if (!id) {
      throw new BadRequestException('id must be provided');
    }

    const user = await this._userRepository.findOne(id, {
      where: { status: status.ACTIVE },
    });

    if (!user) {
      throw new NotFoundException();
    }

    const userObject = classToPlain(user);

    return plainToClass(ReadUserDto, userObject);
  }

  async update(userId: number, user: UpdateUserDto): Promise<ReadUserDto> {
    const userFound = await this._userRepository.findOne(userId, {
      where: { status: status.ACTIVE },
    });

    if (!userFound) {
      throw new NotFoundException('User not found');
    }
    userFound.username = user.username ? user.username : userFound.username;

    const updatedUser = await this._userRepository.save(userFound);

    const updatedUserObject = classToPlain(updatedUser);

    return plainToClass(ReadUserDto, updatedUserObject);
  }

  async remove(userId: number): Promise<void> {
    const userExist = await this._userRepository.findOne(userId, {
      where: { status: status.ACTIVE },
    });

    if (!userExist) {
      throw new NotFoundException();
    }

    await this._userRepository.update(userId, { status: 'INACTIVE' });
  }

  async setRoleToUser(userId: number, roleId: number): Promise<boolean> {
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
