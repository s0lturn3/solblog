import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagEntity } from './entities/tag.entity';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {

  // #region ==========> PROPERTIES <==========

  // #region PRIVATE
  // [...]
  // #endregion PRIVATE

  // #region PUBLIC
  // [...]
  // #endregion PUBLIC

  // #endregion ==========> PROPERTIES <==========

  constructor(private readonly tagsService: TagsService) { }


  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Creates a new tag.' })
  @Post()
  create(@Body() record: CreateTagDto): Promise<TagEntity> {
    return this.tagsService.create(record);
  }


  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Gets all tags (limit of 10 records if not specified).' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Optional limit filter' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Optional offset filter' })
  @Get()
  findAll(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ): Promise<TagEntity[]> {
    return this.tagsService.findAll({ limit, offset });
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Gets one tag by ID.' })
  @Get('id/:id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<TagEntity> {
    return this.tagsService.getTag(id);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Gets one tag by SLUG.' })
  @Get('slug/:slug')
  findOneBySlug(@Param('slug') slug: string): Promise<TagEntity> {
    return this.tagsService.getTagBySlug(slug);
  }


  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Updates tag data.' })
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() record: UpdateTagDto): Promise<void> {
    return this.tagsService.update(id, record);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Removes a tag.' })
  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.tagsService.delete(id);
  }


  // #region ==========> UTILS <==========
  // [...]
  // #endregion ==========> UTILS <==========

}
