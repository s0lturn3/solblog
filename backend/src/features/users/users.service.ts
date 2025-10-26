/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from 'src/shared/models/dtos/user.dto';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

/**
 * Service responsible for managing operations related to the User entity.
 * 
 * Provides methods for CRUD operations (create, read, update and delete) of users,
 * including paginated search, search by ID, creation, update and removal (soft delete).
 * 
 * @remarks
 * Uses TypeORM repository to interact with the database.
*/
@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepo: Repository<UserEntity>
  ) { }
  
  
  // #region CREATE

  /**
   * Creates a new user record in the database.
   * @param record Data for user creation
  */
  public async create(record: CreateUserDto): Promise<UserEntity> {
    let createdUser: UserEntity;

    try {
      const user = this._userRepo.create(record);
      if (!user) throw new InternalServerErrorException("User was not created.");

      createdUser = await this._userRepo.save(user);
      return await this._userRepo.save(createdUser);
    }
    catch (e) {
      throw new InternalServerErrorException(`An error occurred: ${e.message}`)
    }
  }

  // #endregion CREATE

  // #region READ

  /**
   * Retrieves all users currently registered in the system.
   * @param options Optional filters for role, limit and offset
   * @returns List of users registered in the system or an empty list.
   */
  public async findAll(options?: { username?: string, role?: UserRole; limit?: number; offset?: number }): Promise<UserEntity[]> {
    const userQueryBuilder: SelectQueryBuilder<UserEntity> = this._userRepo
      .createQueryBuilder('users');
    
    if (options?.username) {
      userQueryBuilder.andWhere('users.username LIKE :username', { username: `%${options.username}%` });
    }

    if (options?.role) {
      userQueryBuilder.andWhere('users.role = :role', { role: options.role });
    }

    userQueryBuilder.orderBy('users.username', 'ASC')
      .take(options?.limit ?? 10)
      .skip(options?.offset ?? 0);

    try {
      return await userQueryBuilder.getMany();
    }
    catch (e) {
      throw new InternalServerErrorException(`An error occurred: ${e.message}`)
    }
  }


  /**
   * Finds a user based on their ID
   * @param id ID of the desired user
   * @returns User record, if found
  */
  public async getUser(id: string): Promise<UserEntity> {
    const user = await this._userRepo.findOne({
      where: { id }
    });

    if (!user) throw new NotFoundException('The requested user was not found.');
    return user;
  }
  
  // #endregion READ

  // #region UPDATE

  /**
   * Updates a user record in the database.
   * @param id ID of the desired user
   * @param record User record with updated values
  */
  async update(id: string, record: UpdateUserDto): Promise<void> {
    const userToUpdate = await this._userRepo.findOneBy({ id });
    if (!userToUpdate) throw new NotFoundException('The requested user does not exist.');

    try {
      Object.assign(userToUpdate, record);  // Merges data between existing user and new data
      await this._userRepo.save(userToUpdate);
    }
    catch (e) {
      throw new InternalServerErrorException(`An error occurred while updating: ${e.message}`)
    }
  }


  /**
   * Updates a user password in the database.
   * @param id ID of the user to change password
   * @param changePasswordDto Old and new password data
   */
  async changePassword(id: string, changePasswordDto: ChangePasswordDto): Promise<void> {
    const { oldPassword, newPassword } = changePasswordDto;

    // 1. Find the user
    const user = await this._userRepo.createQueryBuilder('users')
      .addSelect('users.hashed_password')
      .where('users.id = :id', { id: id })
      .getOne();

    if (!user) throw new NotFoundException('User not found.');

    
    // Check if the new password is different from the old one
    if (oldPassword === newPassword) throw new BadRequestException('The new password cannot be the same as the current password.');
    
    // 2. Verify old password
    const isPasswordValid = await user.comparePassword(oldPassword);

    if (!isPasswordValid) throw new UnauthorizedException('Invalid current password.');
    
    // 3. Encrypt and save the new password
    user.hashed_password = newPassword; 
    await this._userRepo.save(user);
  }

  // #endregion UPDATE

  // #region DELETE
  
  /**
   * Deletes a user record from the database based on their ID.
   * @param id ID of the desired user
  */
  public async delete(id: string): Promise<void> {
    try {
      await this._userRepo.delete(id);
    }
    catch (e) {
      throw new InternalServerErrorException(`An error occurred while deleting: ${e.message}`)
    }
  }

  // #endregion DELETE


  // #region UTILS
  
  /**
   * Retrieves the author (user) based on their ID.
   * @param authorId ID of the author to retrieve
   * @returns User corresponding to the author ID
  */
  async getAuthor(authorId: string): Promise<UserEntity> {
    const author = await this._userRepo.findOne({ where: { id: authorId } });
    if (!author) throw new NotFoundException(`Author not found for ID ${authorId}`);

    return author;
  }

  // #endregion UTILS

}
