import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/shared/models/dtos/user.dto';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {

  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  hashed_password: string;

  @ApiProperty({ enum: UserRole })
  role: UserRole;

}
