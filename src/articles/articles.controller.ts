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
import { extname, join } from 'path';
import { existsSync, unlinkSync } from 'fs';

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
        destination: './uploads', // Carpeta donde se guardan las imágenes
        filename: (req, file, cb) => {
          const id = req.params.id; // ID del artículo como nombre de archivo
          const fileExt = extname(file.originalname); // Extraer la extensión del archivo
          const filename = `${id}${fileExt}`;

          // Ruta completa de la imagen anterior
          const oldImagePath = join(__dirname, '..', '..', 'uploads', filename);

          // Si ya existe una imagen con ese nombre, eliminarla antes de guardar la nueva
          if (existsSync(oldImagePath)) {
            unlinkSync(oldImagePath);
          }

          cb(null, filename);
        },
      }),
    }),
  )
  async uploadImage(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.articlesService.uploadImage(Number(id), file.filename);
  }

  @Get('/search/:query')
  search(@Param('query') query: string) {
    try {
      return this.articlesService.search(query);
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
