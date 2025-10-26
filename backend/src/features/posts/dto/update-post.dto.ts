import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PostStatus } from 'src/shared/models/dtos/post.dto';
import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  body_markdown: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  rendered_html?: string;

  @ApiProperty({ enum: PostStatus })
  @IsEnum(PostStatus)
  status: PostStatus;

  @ApiProperty()
  @IsBoolean()
  is_private: boolean;

  @ApiProperty({ required: false, default: new Date() })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  updated_at: Date;


  @ApiProperty({ required: false, description: 'Tags associated with the post', type: [ String ] })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  tags?: string[];

}
