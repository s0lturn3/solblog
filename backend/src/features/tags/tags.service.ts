/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { TagEntity } from './entities/tag.entity';

import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

/**
 * Service responsible for managing operations related to the Tag entity.
 * 
 * Provides methods for CRUD operations (create, read, update and delete) of tags,
 * including paginated search, search by ID, creation, update and removal (hard delete).
 * 
 * @remarks
 * Uses TypeORM repository to interact with the database.
*/
@Injectable()
export class TagsService {

  constructor(
    @InjectRepository(TagEntity)
    private readonly _tagRepo: Repository<TagEntity>,
  ) { }


  // #region CREATE

  /**
   * Creates a new tag record in the database.
   * @param record Data for tag creation
  */
  async create(record: CreateTagDto): Promise<TagEntity> {
    let createdTag: TagEntity;
        
    try {
      const tag = this._tagRepo.create(record);
      if (!tag) throw new InternalServerErrorException("Tag was not created.");

      createdTag = await this._tagRepo.save(tag);
      return await this._tagRepo.save(createdTag);
    }
    catch (e) {
      throw new InternalServerErrorException(`An error occurred: ${e.message}`)
    }
  }

  // #endregion CREATE

  // #region READ

  /**
   * Retrieves all tags currently registered in the system.
   * @param options Optional filters for status, limit and offset
   * @returns List of tags registered in the system or an empty list.
  */
  async findAll(options?: { limit?: number; offset?: number }): Promise<TagEntity[]> {
    const tagQueryBuilder: SelectQueryBuilder<TagEntity> = this._tagRepo
      .createQueryBuilder('tags');

    tagQueryBuilder.orderBy('tags.name', 'ASC')
      .take(options?.limit ?? 10)
      .skip(options?.offset ?? 0);

    try {
      return await tagQueryBuilder.getMany();
    }
    catch (e) {
      throw new InternalServerErrorException(`An error occurred: ${e.message}`)
    }
  }

  /**
   * Finds a tag based on their ID
   * @param id ID of the desired tag
   * @returns Tag record, if found
  */
  async getTag(id: number): Promise<TagEntity> {
    const tag = await this._tagRepo.findOneBy({ id });
    if (!tag) throw new NotFoundException('The requested tag was not found.');

    return tag;
  }

  /**
   * Finds a tag based on their SLUG
   * @param slug SLUG of the desired tag
   * @returns Tag record, if found
  */
  async getTagBySlug(slug: string): Promise<TagEntity> {
    const tag = await this._tagRepo.findOneBy({ slug });
    if (!tag) throw new NotFoundException('The requested tag was not found.');

    return tag;
  }

  // #endregion READ

  // #region UPDATE

  /**
   * Updates a tag record in the database.
   * @param id ID of the desired tag
   * @param record Post record with updated values
  */
  async update(id: number, record: UpdateTagDto): Promise<void> {
    const tagToUpdate = await this._tagRepo.findOneBy({ id });
    if (!tagToUpdate) throw new NotFoundException('The requested tag does not exist.');

    try {
      Object.assign(tagToUpdate, record);  // Merges data between existing post and new data
      await this._tagRepo.save(tagToUpdate);
    }
    catch (e) {
      throw new InternalServerErrorException(`An error occurred while updating: ${e.message}`)
    }
  }

  // #endregion UPDATE

  // #region DELETE

  /**
   * Deletes a tag record from the database based on their ID.
   * @param id ID of the desired tag
  */
  async delete(id: number): Promise<void> {
    try {
      await this._tagRepo.delete(id);
    }
    catch (e) {
      throw new InternalServerErrorException(`An error occurred while deleting: ${e.message}`)
    }
  }

  // #endregion DELETE


  // #region UTILS

  /**
   * Gets existing tags by name or creates them if they do not exist.
   * @param tagNames Array of tag names
   * @returns Array of Tag instances
   */
  async getOrCreateTags(tagNames: string[]): Promise<TagEntity[]> {
    if (!tagNames?.length) return [];

    return await Promise.all(
      tagNames.map(async (name) => {
        const normalized = name.trim().toLowerCase();
        let tag = await this._tagRepo.findOne({ where: { name: normalized } });

        if (!tag) {
          tag = this._tagRepo.create({ name: normalized });
          tag = await this._tagRepo.save(tag);
        }

        return tag;
      })
    );
  }

  // #endregion UTILS

}
