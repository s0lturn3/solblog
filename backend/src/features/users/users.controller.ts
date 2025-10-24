import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
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
  @ApiResponse({ status: 201, description: 'User created successfully.', type: User })
  @ApiResponse({ status: 400, description: 'Request error occurred. Check parameters.' })
  @ApiResponse({ status: 500, description: 'Internal server error occurred.' })
  @Post()
  create(@Body() record: CreateUserDto): Promise<User> {
    return this.usersService.create(record);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieves the list of users.' })
  @ApiResponse({ status: 200, description: 'Users found.', type: User })
  @ApiResponse({ status: 400, description: 'Request error occurred. Check parameters.' })
  @ApiResponse({ status: 404, description: 'Desired user was not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error occurred.' })
  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reads a user record.' })
  @ApiResponse({ status: 200, description: 'User found.', type: User })
  @ApiResponse({ status: 400, description: 'Request error occurred. Check parameters.' })
  @ApiResponse({ status: 404, description: 'Desired user was not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error occurred.' })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.getUser(id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Updates a user record.' })
  @ApiResponse({ status: 204, description: 'User updated successfully.', type: User })
  @ApiResponse({ status: 400, description: 'Request error occurred. Check parameters.' })
  @ApiResponse({ status: 500, description: 'Internal server error occurred.' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() record: UpdateUserDto) {
    return this.usersService.update(id, record);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Updates a user password.' })
  @ApiResponse({ status: 400, description: 'Request error occurred. Check parameters.' })
  @ApiResponse({ status: 500, description: 'Internal server error occurred.' })
  @Patch('change-password/:id')
  async changePassword(@Param('id') id: string, @Body() changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {    
    await this.usersService.changePassword(id, changePasswordDto);
    return { message: 'Password changed successfully.' };
  }
  
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Removes a user record.' })
  @ApiResponse({ status: 204, description: 'User removed successfully.', type: Number })
  @ApiResponse({ status: 400, description: 'Request error occurred. Check parameters.' })
  @ApiResponse({ status: 500, description: 'Internal server error occurred.' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.delete(id);
  }


  // #region ==========> UTILS <==========
  // [...]
  // #endregion ==========> UTILS <==========

}
