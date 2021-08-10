import { genSalt, hash } from 'bcryptjs';
import { Role } from '../../role/entities/role.entity';
import { RoleType } from '../../role/roleType.enum';
import { UsersDetails } from '../../user/entities/user.details.entity';
import { User } from '../../user/entities/user.entity';
import { EntityRepository, getConnection, Repository } from 'typeorm';
import { SignupDto } from '../dto/signup.dto';

@EntityRepository(User)
export class AuthRepository extends Repository<User> {
  async signup(signupDto: SignupDto) {
    const { username, email, password } = signupDto;
    const user = new User();

    user.username = username;
    user.email = email;

    const roleRepository = await getConnection().getRepository(Role);

    const defaultRole: Role = await roleRepository.findOne({
      where: { name: RoleType.GENERAL },
    });

    user.roles = [defaultRole];

    const details = new UsersDetails();
    user.details = details;

    const salt = await genSalt(10);
    user.password = await hash(password, salt);

    await user.save();
  }
}
