/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

/**
 * Serviço responsável por gerenciar operações relacionadas à entidade Campanha.
 * 
 * Fornece métodos para CRUD (criação, leitura, atualização e exclusão) de campanhas,
 * incluindo busca paginada, busca por ID, criação, atualização e remoção (soft delete).
 * 
 * @remarks
 * Utiliza o repositório do TypeORM para interagir com a base de dados.
*/
@Injectable()
export class UsersService {

  /**
   * Cria uma instância do PostsService.
   * @param _postRepo Repositório do TypeORM para a entidade Post.
  */
  constructor(
    @InjectRepository(User)
    private readonly _userRepo: Repository<User>
  ) { }
  
  
  // #region CREATE

  /**
   * Cria um registro novo de usuário no banco de dados.
   * @param createUserDto Dados para criação do usuário
   */
  public async create(record: CreateUserDto): Promise<User> {
    let createdUser: User;

    try {
      const user = this._userRepo.create(record);
      if (!user) throw new InternalServerErrorException("O Usuário não foi criado.");

      createdUser = await this._userRepo.save(user);
      return await this._userRepo.save(createdUser);
    }
    catch (e) {
      throw new InternalServerErrorException(`Ocorreu um erro.: ${e.message}`)
    }
  }

  // #endregion CREATE

  // #region READ

  /**
   * Busca todos os usuários já cadastrados no sistema atualmente.
   * @returns Lista de usuários já cadastrados no sistema ou uma lista vazia.
   */
  public async findAll(): Promise<User[]> {
    const users = await this._userRepo.find();
    return users ?? [];
  }

  /**
   * Busca um usuário com base no seu ID
   * @param id ID do usuário desejado
   * @returns Registro do usuário, caso encontre
  */
  public async getUser(id: string): Promise<User> {
    const user = await this._userRepo.findOne({
      where: { id }
    });

    if (!user) throw new NotFoundException('O usuário desejado não foi encontrado.');
    return user;
  }
  
  // #endregion READ

  // #region UPDATE
  
  update(id: string, record: UpdateUserDto) {
    return `This action updates a #${id} ${record.username} post`;
  }

  // #endregion UPDATE

  // #region DELETE
  
  remove(id: string) {
    return `This action removes a #${id} user`;
  }

  // #endregion DELETE


  // #region UTILS
  // [...]
  // #endregion UTILS

}
