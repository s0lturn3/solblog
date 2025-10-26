import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PostStatus } from 'src/shared/models/dtos/post.dto';
import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  body_markdown: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  rendered_html?: string;

  @ApiProperty({ enum: PostStatus, default: PostStatus.DRAFT })
  @IsEnum(PostStatus)
  status: PostStatus;

  @ApiProperty()
  @IsBoolean()
  is_private: boolean;

  @ApiProperty({ default: new Date() })
  @IsDate()
  @Type(() => Date)
  updated_at: Date;

}
