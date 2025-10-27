import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { PostStatus } from 'src/shared/models/dtos/post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';
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


  /*
  TODO: Implement the following endpoints:
    - /posts/:id/revisions
    - /posts/:id/comments
    - /posts/:id/tags
  */

  
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Creates a new post record in the system.' })
  @Post()
  create(@Body() record: CreatePostDto): Promise<PostEntity> {
    return this._postsService.create(record);
  }


  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Gets all posts (limit of 10 records if not specified).' })
  @ApiQuery({ name: 'tags', required: false, type: String, description: 'Optional tags filter' })
  @ApiQuery({ name: 'status', required: false, type: String, description: 'Optional status filter (values are the PostStatus enum)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Optional limit filter' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Optional offset filter' })
  @Get()
  findAll(
    @Query('tags') tags?: string,
    @Query('status') status?: PostStatus,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ): Promise<PostEntity[]> {
    const tagArray = tags ? tags.split(',') : undefined;

    return this._postsService.findAll({ tags: tagArray, status, limit, offset });
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Gets all posts from a specified user (limit of 10 records if not specified).' })
  @ApiQuery({ name: 'tags', required: false, type: String, description: 'Optional tags filter' })
  @ApiQuery({ name: 'status', required: false, type: String, description: 'Optional status filter (values are the PostStatus enum)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Optional limit filter' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Optional offset filter' })
  @Get(':userId/posts')
  findAllByUser(
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Query('tags') tags?: string,
    @Query('status') status?: PostStatus,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ): Promise<PostEntity[]> {
    const tagArray = tags ? tags.split(',') : undefined;
    return this._postsService.findAllByUser(userId, { tags: tagArray, status: status, limit: limit, offset: offset });
  }


  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Gets one post by ID.' })
  @Get('id/:id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<PostEntity> {
    return this._postsService.getPost(id);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Gets one post by SLUG.' })
  @Get('slug/:slug')
  findOneBySlug(@Param('slug') slug: string): Promise<PostEntity> {
    return this._postsService.getPostBySlug(slug);
  }


  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Updates post data.' })
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() record: UpdatePostDto): Promise<void> {
    return this._postsService.update(id, record);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Publishes a post.' })
  @Patch(':id/publish')
  publishPost(@Param('id', ParseIntPipe) id: number): Promise<PostEntity> {
    return this._postsService.publishPost(id);
  }


  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Removes a post.' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this._postsService.delete(id);
  }


  // #region ==========> UTILS <==========
  // [...]
  // #endregion ==========> UTILS <==========

}
