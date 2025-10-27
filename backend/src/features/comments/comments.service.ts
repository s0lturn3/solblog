/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentEntity } from './entities/comment.entity';

/**
 * Service responsible for managing operations related to the Comment entity.
 * 
 * Provides methods for CRUD operations (create, read, update and delete) of comments,
 * including paginated search, search by ID, creation, update and removal (soft delete).
 * 
 * @remarks
 * Uses TypeORM repository to interact with the database.
*/
@Injectable()
export class CommentsService {

  constructor(
    @InjectRepository(CommentEntity)
    private readonly _commentRepo: Repository<CommentEntity>,
  ) {

  }


  // #region CREATE
    
  /**
   * Creates a new comment record in the database.
   * @param record Data for comment creation
  */
  async create(record: CreateCommentDto): Promise<CommentEntity> {
    try {
      const comment = this._commentRepo.create({ ...record });
      return await this._commentRepo.save(comment);
    }
    catch (e) {
      throw new InternalServerErrorException(`Failed to create comment: ${e.message}`);
    }
  }

  // #endregion CREATE

  // #region READ

  /**
   * Retrieves all comments belonging to a specified user.
   * @param options Optional filters for status, limit and offset
   * @returns List of comments belonging to the user or an empty list.
  */
  async getCommentsByUser(userId: string, options?: { limit?: number; offset?: number }): Promise<CommentEntity[]> {
    const commentQueryBuilder: SelectQueryBuilder<CommentEntity> = this._commentRepo
      .createQueryBuilder('comments')
      .where('comments.author_id = :userId', { userId });

    commentQueryBuilder.orderBy('comments.created_at', 'DESC')
      .take(options?.limit ?? 10)
      .skip(options?.offset ?? 0);

    try {
      return await commentQueryBuilder.getMany();
    }
    catch (e) {
      throw new InternalServerErrorException(`An error occurred: ${e.message}`)
    }
  }

  /**
   * Retrieves all comments belonging to a specified post.
   * @param options Optional filters for status, limit and offset
   * @returns List of comments belonging to the user or an empty list.
  */
  async getCommentsByPost(postId: number, options?: { limit?: number; offset?: number }): Promise<CommentEntity[]> {
    const postQueryBuilder: SelectQueryBuilder<CommentEntity> = this._commentRepo
      .createQueryBuilder('comments')
      .where('comments.post_id = :postId', { postId });

    postQueryBuilder.orderBy('comments.created_at', 'DESC')
      .take(options?.limit ?? 10)
      .skip(options?.offset ?? 0);

    try {
      return await postQueryBuilder.getMany();
    }
    catch (e) {
      throw new InternalServerErrorException(`An error occurred: ${e.message}`)
    }
  }


  /**
   * Finds a comment based on their ID
   * @param id ID of the desired comment
   * @returns Comment record, if found
  */
  async getComment(id: string): Promise<CommentEntity> {
    const comment = await this._commentRepo.findOneBy({ id });

    if (!comment) throw new NotFoundException('The requested comment was not found.');
    return comment;
  }
  
  // #endregion READ

  // #region UPDATE
  
  /**
   * Updates a comment record in the database.
   * @param id ID of the desired comment
   * @param record Post record with updated values
  */
  async update(id: string, record: UpdateCommentDto): Promise<void> {
    const commentToUpdate = await this._commentRepo.findOneBy({ id });
    if (!commentToUpdate) throw new NotFoundException('The requested comment does not exist.');
    
    try {
      Object.assign(commentToUpdate, record);
      await this._commentRepo.save(commentToUpdate);
    }
    catch (e) {
      throw new InternalServerErrorException(`An error occurred while updating: ${e.message}`)
    }
  }

  // #endregion UPDATE

  // #region DELETE
  
  /**
   * Deletes a post record from the database based on their ID.
   * @param id ID of the desired post
  */
  async delete(id: string): Promise<void> {
    try {
      await this._commentRepo.softDelete(id);
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
