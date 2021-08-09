import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection } from 'typeorm';
import { MapperService } from '../../shared/mapper.service';
import { Role } from '../role/entities/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UsersDetails } from './entities/user.details.entity';
import { User } from './entities/user.entity';
import { UserRepository } from './entities/user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly _userRepository: UserRepository,
    private readonly _mapperService: MapperService,
  ) {}

  async create(user: User) {
    const details = new UsersDetails();
    user.details = details;

    const repo = await getConnection().getRepository(Role);

    const defaultRole = await repo.findOne({ where: { name: 'GENERAL' } });

    user.roles = [defaultRole];

    const savedUser: User = await this._userRepository.save(user);
    return this._mapperService.map<User, UserDto>(savedUser, new UserDto());
  }

  async findAll(): Promise<UserDto[]> {
    const users = await this._userRepository.find({
      where: { status: 'ACTIVE' },
    });
    if (!users) {
      throw new NotFoundException();
    }

    return this._mapperService.mapCollection<User, UserDto>(
      users,
      new UserDto(),
    );
  }

  async findOne(id: number): Promise<UserDto> {
    if (!id) {
      throw new BadRequestException('id must be provided');
    }

    const user = await this._userRepository.findOne(id, {
      where: { status: 'ACTIVE' },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return this._mapperService.map<User, UserDto>(user, new UserDto());
  }

  async update(id: number, user: User): Promise<void> {
    await this._userRepository.update(id, user);
  }

  async remove(id: number): Promise<void> {
    const userExists = await this._userRepository.findOne(id, {
      where: { status: 'ACTIVE' },
    });

    if (!userExists) {
      throw new NotFoundException();
    }

    await this._userRepository.update(id, { status: 'INACTIVE' });
  }
}
