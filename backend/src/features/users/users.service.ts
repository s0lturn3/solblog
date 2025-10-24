/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

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

  /**
   * Creates an instance of UsersService.
   * @param _userRepo TypeORM repository for the User entity.
  */
  constructor(
    @InjectRepository(User)
    private readonly _userRepo: Repository<User>
  ) { }
  
  
  // #region CREATE

  /**
   * Creates a new user record in the database.
   * @param createUserDto Data for user creation
  */
  public async create(record: CreateUserDto): Promise<User> {
    let createdUser: User;

    try {
      const user = this._userRepo.create(record);
      if (!user) throw new InternalServerErrorException("User was not created.");

      createdUser = await this._userRepo.save(user);
      return await this._userRepo.save(createdUser);
    }
    catch (e) {
      throw new InternalServerErrorException(`An error occurred.: ${e.message}`)
    }
  }

  // #endregion CREATE

  // #region READ

  /**
   * Retrieves all users currently registered in the system.
   * @returns List of users registered in the system or an empty list.
   */
  public async findAll(): Promise<User[]> {
    const users = await this._userRepo.find();
    return users ?? [];
  }

  /**
   * Finds a user based on their ID
   * @param id ID of the desired user
   * @returns User record, if found
  */
  public async getUser(id: string): Promise<User> {
    const user = await this._userRepo.findOne({
      where: { id }
    });

    if (!user) throw new NotFoundException('The requested user was not found.');
    return user;
  }
  
  // #endregion READ

  // #region UPDATE

  async update(id: string, record: UpdateUserDto): Promise<User> {

    const userToUpdate = await this._userRepo.findOneBy({ id });
    if (!userToUpdate) throw new NotFoundException('The requested user does not exist.');

    try {
      Object.assign(userToUpdate, record);  // Merges data between existing user and new data
      return this._userRepo.save(userToUpdate);
    }
    catch (e) {
      throw new InternalServerErrorException(`An error occurred while updating: ${e.message}`)
    }
  }


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
  // [...]
  // #endregion UTILS

}
