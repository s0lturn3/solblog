import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
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

  
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Creates a new post record in the system.' })
  @Post()
  create(@Body() record: CreatePostDto): Promise<PostEntity> {
    return this._postsService.create(record);
  }


  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all posts (limit of 10 records if not specified).' })
  @ApiQuery({ name: 'status', required: false, type: String, description: 'Optional status filter (values are the PostStatus enum)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Optional limit filter' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Optional status filter' })
  @Get()
  findAll(
    @Query('status') status?: PostStatus,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ): Promise<PostEntity[]> {
    return this._postsService.findAll({ status: status, limit: limit, offset: offset });
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all posts from a specified user (limit of 10 records if not specified).' })
  @ApiQuery({ name: 'status', required: false, type: String, description: 'Optional status filter (values are the PostStatus enum)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Optional limit filter' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Optional status filter' })
  @Get(':userId/posts')
  findAllByUser(
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Query('status') status?: PostStatus,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ): Promise<PostEntity[]> {
    return this._postsService.findAllByUser(userId, { status: status, limit: limit, offset: offset });
  }


  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get one post.' })
  @Get(':id')
  findOne(@Param('id') id: number): Promise<PostEntity> {
    return this._postsService.getPost(id);
  }


  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Update post data.' })
  @Patch(':id')
  update(@Param('id') id: number, @Body() record: UpdatePostDto): Promise<void> {
    return this._postsService.update(id, record);
  }


  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove post.' })
  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this._postsService.delete(id);
  }

  // #region ==========> UTILS <==========
  // [...]
  // #endregion ==========> UTILS <==========

}
