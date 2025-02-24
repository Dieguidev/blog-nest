import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'], // Opcional: habilita logs de Prisma
    });
  }

  async onModuleInit() {
    await this.$connect(); // Conectar a la base de datos cuando el módulo se inicie
  }

  async onModuleDestroy() {
    await this.$disconnect(); // Desconectar de la base de datos cuando el módulo se destruya
  }
}
