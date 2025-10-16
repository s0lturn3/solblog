import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
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

  
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  // @Roles(UserRole.ADMINISTRATOR)
  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lê o registro de um usuário.' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado.', type: User })
  @ApiResponse({ status: 400, description: 'Ocorreu um erro com a requisição. Verifique os parâmetros.' })
  @ApiResponse({ status: 404, description: 'O usuário desejado não foi encontrado.' })
  @ApiResponse({ status: 500, description: 'Ocorreu um erro interno de servidor.' })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.getUser(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }


  // #region ==========> UTILS <==========
  // [...]
  // #endregion ==========> UTILS <==========

}
