/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {

  // #region ==========> PROPERTIES <==========

  // #region PRIVATE
  // [...]
  // #endregion PRIVATE

  // #region PUBLIC
  // [...]
  // #endregion PUBLIC

  // #endregion ==========> PROPERTIES <==========

  constructor( private readonly _postsService: PostsService ) { }

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this._postsService.create(createPostDto);
  }

  @Get()
  findAll() {
    return this._postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this._postsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this._postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this._postsService.remove(+id);
  }

  // #region ==========> UTILS <==========
  // [...]
  // #endregion ==========> UTILS <==========

}
