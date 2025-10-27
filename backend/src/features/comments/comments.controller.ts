import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentEntity } from './entities/comment.entity';

@Controller('comments')
export class CommentsController {

  // #region ==========> PROPERTIES <==========

  // #region PRIVATE
  // [...]
  // #endregion PRIVATE

  // #region PUBLIC
  // [...]
  // #endregion PUBLIC

  // #endregion ==========> PROPERTIES <==========

  constructor(private readonly commentsService: CommentsService) {}


  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Creates a new comment record in the system.' })
  @Post()
  async create(@Body() createCommentDto: CreateCommentDto): Promise<CommentEntity> {
    return this.commentsService.create(createCommentDto);
  }


  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Gets all comments in a post (limit of 10 records if not specified).' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Optional limit filter' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Optional offset filter' })
  @Get('post/:postId')
  async getCommentsByPost(
    @Param('postId', ParseIntPipe) postId: number,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ): Promise<CommentEntity[]> {
    return await this.commentsService.getCommentsByPost(postId, { limit, offset });
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Gets all comments from a user (limit of 10 records if not specified).' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Optional limit filter' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Optional offset filter' })
  @Get('user/:userId')
  async getCommentsByUser(
    @Param('userId') userId: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ): Promise<CommentEntity[]> {
    return await this.commentsService.getCommentsByUser(userId, { limit, offset });
  }

  
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Updates comment data.' })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() record: UpdateCommentDto): Promise<void> {
    return this.commentsService.update(id, record);
  }


  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Removes a comment.' })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.commentsService.delete(id);
  }


  // #region UTILS
  // [...]
  // #endregion UTILS

}
