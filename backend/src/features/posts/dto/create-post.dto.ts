import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { PostStatus } from "src/shared/models/dtos/post.dto";

export class CreatePostDto {

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

  @ApiProperty({ enum: PostStatus })
  @IsEnum(PostStatus)
  status: PostStatus;

  @ApiProperty({ default: new Date() })
  @IsDate()
  @Type(() => Date)
  created_at: Date;

  @ApiProperty({ default: null, required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  published_at?: Date;

  @ApiProperty()
  @IsBoolean()
  is_private: boolean;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  author_id: string;

}
