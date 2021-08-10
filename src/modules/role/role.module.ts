import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleRepository } from './entities/role.repository';
import { SharedModule } from '../../shared/shared.module';

@Module({
  imports: [TypeOrmModule.forFeature([RoleRepository]), SharedModule],
  providers: [RoleService],
  controllers: [RoleController],
})
export class RoleModule {}
