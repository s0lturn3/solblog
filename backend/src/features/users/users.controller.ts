import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { UserRole } from 'src/shared/models/dtos/user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

  // #region ==========> PROPERTIES <==========
  
  // #region PRIVATE
  // [...]
  // #endregion PRIVATE

  // #region PUBLIC
  // [...]
  // #endregion PUBLIC

  // #endregion ==========> PROPERTIES <==========


  constructor( private readonly usersService: UsersService ) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Creates a new user record in the system.' })
  @Post()
  create(@Body() record: CreateUserDto): Promise<UserEntity> {
    return this.usersService.create(record);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all users (limit of 10 records if not specified).' })
  @ApiQuery({ name: 'username', required: false, type: String, description: 'Optional username filter' })
  @ApiQuery({ name: 'role', required: false, type: String, description: 'Optional role filter (values are the UserRole enum)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Optional limit filter' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Optional status filter' })  
  @Get()
  findAll(
    @Query('username') username?: string,
    @Query('role') role?: UserRole,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ): Promise<UserEntity[]> {
    return this.usersService.findAll({ username, role, limit, offset });
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get one user.' })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<UserEntity> {
    return this.usersService.getUser(id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Update profile or role.' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() record: UpdateUserDto): Promise<void> {
    return this.usersService.update(id, record);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Change user password.' })
  @Patch('change-password/:id')
  async changePassword(@Param('id') id: string, @Body() changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {    
    await this.usersService.changePassword(id, changePasswordDto);
    return { message: 'Password changed successfully.' };
  }
  
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove user.' })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.delete(id);
  }


  // #region ==========> UTILS <==========
  // [...]
  // #endregion ==========> UTILS <==========

}
