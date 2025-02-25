import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { GetAllArticlesDto } from './dto/get-all-articles.dto';
import { join } from 'path';
import { existsSync, unlinkSync } from 'fs';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  async create(createArticleDto: CreateArticleDto) {
    try {
      const article = await this.prisma.article.create({
        data: createArticleDto,
      });
      return {
        status: 'success',
        article,
        message: 'Article created successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async findAll(getAllArticlesDto: GetAllArticlesDto) {
    const { limit } = getAllArticlesDto;
    const articles = await this.prisma.article.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
    if (articles.length === 0) {
      throw new BadRequestException('No articles found');
    }
    return {
      status: 'success',
      articles,
    };
  }

  async findOne(id: number) {
    const article = await this.prisma.article.findUnique({
      where: { id },
    });
    if (!article) {
      throw new BadRequestException('Article not found');
    }
    return {
      status: 'success',
      article,
    };
  }

  async update(id: number, updateArticleDto: UpdateArticleDto) {
    await this.findOne(id);
    const updatedArticle = await this.prisma.article.update({
      where: { id },
      data: updateArticleDto,
    });
    return {
      status: 'success',
      article: updatedArticle,
    };
  }


  async remove(id: number) {
    await this.findOne(id);
    const deletedArticle = await this.prisma.article.delete({
      where: { id },
    });
    return {
      status: 'success',
      article: deletedArticle,
    };
  }

  async uploadImage(id: number, filename: string) {
    const imageUrl = `http://localhost:3000/uploads/${filename}`;

    // Obtener el artículo y verificar si tiene una imagen previa
    const article = await this.prisma.article.findUnique({
      where: { id },
      select: { image: true }, // Solo traemos la imagen
    });

    // Si existe una imagen previa, eliminarla
    if (article?.image) {
      const oldImagePath = join(__dirname, '..', '..', 'uploads', article.image.split('/').pop());
      if (existsSync(oldImagePath)) {
        unlinkSync(oldImagePath); // Eliminar la imagen anterior
      }
    }

    // Actualizar el campo `image` con la nueva imagen
    const updatedArticle = await this.prisma.article.update({
      where: { id },
      data: { image: imageUrl },
    });

    return { message: 'Image uploaded successfully', article: updatedArticle };
  }
}
