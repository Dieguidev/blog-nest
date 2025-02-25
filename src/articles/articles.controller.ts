import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  InternalServerErrorException,
  Query,
  UseInterceptors,
  BadRequestException,
  UploadedFile,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { GetAllArticlesDto } from './dto/get-all-articles.dto';
import { IdValidationPipe } from 'src/common/pipes/id-validation.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  create(@Body() createArticleDto: CreateArticleDto) {
    try {
      return this.articlesService.create(createArticleDto);
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  @Get()
  findAll(@Query() getAllArticlesDto: GetAllArticlesDto) {
    try {
      return this.articlesService.findAll(getAllArticlesDto);
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  @Get(':id')
  findOne(@Param('id', IdValidationPipe) id: string) {
    try {
      return this.articlesService.findOne(+id);
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    try {
      return this.articlesService.update(+id, updateArticleDto);
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.articlesService.remove(+id);
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  @Post('/uploadImage/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const id = req.params.id;
          const fileExt = extname(file.originalname); // Obtener la extensión del archivo
          const filename = `${id}${fileExt}`; // Nombre del archivo basado en el ID
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return cb(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadImage(
    @Param('id', IdValidationPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    return this.articlesService.uploadImage(+id, file.filename);
  }
}
