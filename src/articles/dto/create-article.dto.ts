import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateArticleDto {
  @IsNotEmpty()
  @IsString()
  @Length(5)
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}
