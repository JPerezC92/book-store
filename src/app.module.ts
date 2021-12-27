import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';
import { AuthModule } from './modules/auth/auth.module';
import { BookModule } from './modules/book/book.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['.development.env'] }),
    DatabaseModule,
    UserModule,
    RoleModule,
    AuthModule,
    BookModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
