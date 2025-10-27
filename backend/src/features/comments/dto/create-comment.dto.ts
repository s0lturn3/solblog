import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCommentDto {

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
    description: 'Date and time when the comment was created',
    required: false,
    default: new Date()
  })
  @IsDate()
  @Type(() => Date)
  created_at?: Date;

  @ApiProperty({ required: false, description: 'ID of the parent comment, if this is a reply' })
  @IsString()
  @IsOptional()
  parent_id?: string;

}
