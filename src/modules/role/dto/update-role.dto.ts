import { IsString, MaxLength } from 'class-validator';

export class UpdateRoleDto {
  @IsString()
  @MaxLength(50, { message: 'this name is not valid' })
  readonly name: string;

  @IsString()
  @MaxLength(100, { message: 'this description is not valid' })
  readonly description: string;
}
