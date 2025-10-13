/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

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
export class PostsService {

  /**
   * Cria uma instância do PostsService.
   * 
   * @param _postRepo Repositório do TypeORM para a entidade Post.
  */
  constructor(
    @InjectRepository(Post)
    private readonly _postRepo: Repository<Post>
  ) { }
  

  // #region CREATE
  
  create(createPostDto: CreatePostDto) {
    return 'This action adds a new post';
  }

  // #endregion CREATE

  // #region READ

  findAll() {
    return `This action returns all posts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }
  
  // #endregion READ

  // #region UPDATE
  
  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  // #endregion UPDATE

  // #region DELETE
  
  remove(id: number) {
    return `This action removes a #${id} post`;
  }

  // #endregion DELETE


  // #region UTILS
  // [...]
  // #endregion UTILS

}
