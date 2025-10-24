/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChangePasswordDto } from './dto/change-password.dto';
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

  async update(id: string, record: UpdateUserDto): Promise<User> {

    const userToUpdate = await this._userRepo.findOneBy({ id });
    if (!userToUpdate) throw new NotFoundException('O usuário desejado não existe.');

    console.log('userToUpdate:', userToUpdate);

    try {
      // Faz o merge de dados entre o usuário existente e os novos dados
      Object.assign(userToUpdate, record);
      return this._userRepo.save(userToUpdate);
    }
    catch (e) {
      throw new InternalServerErrorException(`Ocorreu um erro ao atualizar.: ${e.message}`)
    }
  }


  async changePassword(id: string, changePasswordDto: ChangePasswordDto): Promise<void> {
    const { oldPassword, newPassword } = changePasswordDto;

    // 1. Encontrar o usuário
    const user = await this._userRepo.createQueryBuilder('users')
      .addSelect('users.hashed_password') // <-- A SOLUÇÃO: Adiciona a coluna 'hashed_password' que está escondida
      .where('users.id = :id', { id: id })
      .getOne();

    if (!user) throw new NotFoundException('Usuário não encontrado.');

    
    // Verifique se a nova senha é diferente da antiga
    if (oldPassword === newPassword) throw new BadRequestException('A nova senha não pode ser igual à senha atual.');
    
    // 2. Verificar a senha antiga (você precisará de um método para isso, geralmente no seu Entity)
    // Assumindo que você tem um método 'comparePassword' na sua Entity
    const isPasswordValid = await user.comparePassword(oldPassword);

    // É uma boa prática de segurança retornar um 401 ou 403, sem dar detalhes
    if (!isPasswordValid) throw new UnauthorizedException('Senha atual inválida.');
    
    // 3. Criptografar e salvar a nova senha
    // A criptografia deve ocorrer automaticamente ao salvar, graças ao TypeORM Hook (Step 4)
    user.hashed_password = newPassword; 
    await this._userRepo.save(user);
    
    // **Opcional:** Invalide qualquer token JWT existente do usuário após a troca de senha
    // (Isso requer lógica adicional no seu serviço de Auth)
  }

  // #endregion UPDATE

  // #region DELETE
  
  public async delete(id: string): Promise<void> {
    try {
      await this._userRepo.delete(id);
    }
    catch (e) {
      throw new InternalServerErrorException(`Ocorreu um erro ao excluir.: ${e.message}`)
    }
  }

  // #endregion DELETE


  // #region UTILS
  // [...]
  // #endregion UTILS

}
