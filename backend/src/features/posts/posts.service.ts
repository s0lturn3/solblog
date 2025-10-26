/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostStatus } from 'src/shared/models/dtos/post.dto';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { TagsService } from '../tags/tags.service';
import { UsersService } from '../users/users.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';

/**
 * Service responsible for managing operations related to the Post entity.
 * 
 * Provides methods for CRUD operations (create, read, update and delete) of posts,
 * including paginated search, search by ID, creation, update and removal (hard delete).
 * 
 * @remarks
 * Uses TypeORM repository to interact with the database.
*/
@Injectable()
export class PostsService {

  constructor(
    @InjectRepository(PostEntity)
    private readonly _postRepo: Repository<PostEntity>,

    private readonly _usersService: UsersService,
    private readonly _tagsService: TagsService,
  ) { }
  

  // #region CREATE
  
  /**
   * Creates a new post record in the database.
   * @param record Data for post creation
  */
  async create(record: CreatePostDto): Promise<PostEntity> {
    try {
      const author = await this._usersService.getAuthor(record.author_id);
      const tags = await this._tagsService.getOrCreateTags(record.tags ?? []);

      const post = this._postRepo.create({
        ...record,
        author,
        tags,
      });

      return await this._postRepo.save(post);
    }
    catch (e) {
      throw new InternalServerErrorException(`Failed to create post: ${e.message}`);
    }
  }

  // #endregion CREATE

  // #region READ

  /**
   * Retrieves all posts currently registered in the system.
   * @param options Optional filters for status, limit and offset
   * @returns List of posts registered in the system or an empty list.
  */
  async findAll(options?: { tags?: string[], status?: PostStatus; limit?: number; offset?: number }): Promise<PostEntity[]> {
    const postQueryBuilder: SelectQueryBuilder<PostEntity> = this._postRepo
      .createQueryBuilder('posts')
      .leftJoinAndSelect('posts.tags', 'tag')
      .leftJoinAndSelect('posts.author', 'author');

    if (options?.status) {
      postQueryBuilder.andWhere('posts.status = :status', { status: options.status });
    }

    if (options?.tags?.length) {
      postQueryBuilder.innerJoin('posts.tags', 'filterTag', 'filterTag.slug IN (:...slugs)', { slugs: options.tags });
    }

    postQueryBuilder.orderBy('posts.created_at', 'DESC')
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
   * Retrieves all posts belonging to a specified user.
   * @param options Optional filters for status, limit and offset
   * @returns List of posts belonging to the user or an empty list.
  */
  async findAllByUser(userId: string, options?: { tags?: string[], status?: PostStatus; limit?: number; offset?: number }): Promise<PostEntity[]> {
    const postQueryBuilder: SelectQueryBuilder<PostEntity> = this._postRepo
      .createQueryBuilder('post')
      .leftJoinAndSelect('posts.tags', 'tag')
      .leftJoinAndSelect('post.author', 'author')
      .where('author.id = :userId', { userId });

    if (options?.status) {
      postQueryBuilder.andWhere('post.status = :status', { status: options.status });
    }

    if (options?.tags?.length) {
      postQueryBuilder.innerJoin('posts.tags', 'filterTag', 'filterTag.slug IN (:...slugs)', { slugs: options.tags });
    }

    postQueryBuilder.orderBy('post.created_at', 'DESC')
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
   * Finds a post based on their ID
   * @param id ID of the desired post
   * @returns Post record, if found
  */
  async getPost(id: number): Promise<PostEntity> {
    const post = await this._postRepo.findOne({
      where: { id }
    });

    if (!post) throw new NotFoundException('The requested post was not found.');
    return post;
  }

  /**
   * Finds a post based on their SLUG
   * @param slug SLUG of the desired post
   * @returns Post record, if found
  */
  async getPostBySlug(slug: string): Promise<PostEntity> {
    const post = await this._postRepo.findOne({
      where: { slug: slug }
    });

    if (!post) throw new NotFoundException('The requested post was not found.');
    return post;
  }
  
  // #endregion READ

  // #region UPDATE
  
  /**
   * Updates a post record in the database.
   * @param id ID of the desired post
   * @param record Post record with updated values
  */
  async update(id: number, record: UpdatePostDto): Promise<void> {
    const postToUpdate = await this._postRepo.findOneBy({ id });
    if (!postToUpdate) throw new NotFoundException('The requested post does not exist.');
    
    try {
      if (record.tags) {
        postToUpdate.tags = await this._tagsService.getOrCreateTags(record.tags);
      }

      Object.assign(postToUpdate, record);
      await this._postRepo.save(postToUpdate);
    }
    catch (e) {
      throw new InternalServerErrorException(`An error occurred while updating: ${e.message}`)
    }
  }


  /**
   * Publishes a post, changing is status and publish date.
   * @param id ID of the post to publish
  */
  async publishPost(id: number): Promise<PostEntity> {
    const postToPublish = await this._postRepo.findOneBy({ id });
    if (!postToPublish) throw new NotFoundException('The requested post does not exist.');

    postToPublish.status = PostStatus.PUBLISHED;
    postToPublish.published_at = new Date();

    try {
      return await this._postRepo.save(postToPublish);
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
  async delete(id: number): Promise<void> {
    try {
      await this._postRepo.delete(id);
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
