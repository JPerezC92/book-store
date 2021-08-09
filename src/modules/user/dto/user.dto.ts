import { IsNotEmpty } from 'class-validator';
import { RoleType } from 'src/modules/role/roleType.enum';
import { UsersDetails } from '../entities/user.details.entity';

export class UserDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  roles: RoleType[];

  @IsNotEmpty()
  details: UsersDetails;
}
