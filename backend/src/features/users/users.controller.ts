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
  @ApiOperation({ summary: 'Cria um novo registro de usuário no sistema.' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso.', type: User })
  @ApiResponse({ status: 400, description: 'Ocorreu um erro com a requisição. Verifique os parâmetros.' })
  @ApiResponse({ status: 500, description: 'Ocorreu um erro interno de servidor.' })
  @Post()
  create(@Body() record: CreateUserDto): Promise<User> {
    return this.usersService.create(record);
  }

  // @Roles(UserRole.ADMINISTRATOR)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Busca a lista de usuários.' })
  @ApiResponse({ status: 200, description: 'Usuários encontrados.', type: User })
  @ApiResponse({ status: 400, description: 'Ocorreu um erro com a requisição. Verifique os parâmetros.' })
  @ApiResponse({ status: 404, description: 'O usuário desejado não foi encontrado.' })
  @ApiResponse({ status: 500, description: 'Ocorreu um erro interno de servidor.' })
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

  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Atualiza o registro de um usuário.' })
  @ApiResponse({ status: 204, description: 'Usuário atualizado com sucesso.', type: User })
  @ApiResponse({ status: 400, description: 'Ocorreu um erro com a requisição. Verifique os parâmetros.' })
  @ApiResponse({ status: 500, description: 'Ocorreu um erro interno de servidor.' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() record: UpdateUserDto) {
    return this.usersService.update(id, record);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Atualiza a senha de um usuário.' })
  @ApiResponse({ status: 400, description: 'Ocorreu um erro com a requisição. Verifique os parâmetros.' })
  @ApiResponse({ status: 500, description: 'Ocorreu um erro interno de servidor.' })
  @Patch('change-password/:id')
  async changePassword(@Param('id') id: string, @Body() changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {    
    await this.usersService.changePassword(id, changePasswordDto);
    return { message: 'Senha alterada com sucesso.' };
  }
  
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove o registro de um usuário.' })
  @ApiResponse({ status: 204, description: 'Usuário removido com sucesso.', type: Number })
  @ApiResponse({ status: 400, description: 'Ocorreu um erro com a requisição. Verifique os parâmetros.' })
  @ApiResponse({ status: 500, description: 'Ocorreu um erro interno de servidor.' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.delete(id);
  }


  // #region ==========> UTILS <==========
  // [...]
  // #endregion ==========> UTILS <==========

}
