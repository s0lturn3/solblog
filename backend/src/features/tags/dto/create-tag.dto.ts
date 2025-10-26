import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTagDto {

  @ApiProperty({ description: 'Name of the tag' })
  @IsString()
  @IsNotEmpty()
  name: string;
  
  @ApiProperty({ required: false, description: 'URL-friendly version of the tag name' })
  @IsString()
  @IsOptional()
  slug?: string;

}
