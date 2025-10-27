import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateCommentDto } from './create-comment.dto';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {

  @ApiProperty({ description: 'ID of the post to which the comment belongs' })
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  post_id: number;

  @ApiProperty({ required: false, description: 'ID of the comment author' })
  @IsOptional()
  @IsString()
  author_id?: string;

  @ApiProperty({ description: 'Content of the comment' })
  @IsNotEmpty()
  @IsString()
  body: string;

  @ApiProperty({
    description: 'Date and time when the comment was last updated',
    required: false,
    default: new Date()
  })
  @IsDate()
  @Type(() => Date)
  updated_at?: Date;

  @ApiProperty({ required: false, description: 'ID of the parent comment, if this is a reply' })
  @IsString()
  @IsOptional()
  parent_id?: string;

}
