import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UserRepository } from '../user/entities/user.repository';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { BookRepository } from './entities/book.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookRepository, UserRepository]),
    AuthModule,
  ],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
