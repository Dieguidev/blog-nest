import { Type } from "class-transformer";
import { IsInt, IsOptional, Max, Min } from "class-validator";

export class GetAllArticlesDto {
  @IsInt({ message: 'El límite debe ser un número entero' })
  @Min(1, { message: 'El límite debe ser al menos 1' })
  @Max(100, { message: 'El límite no puede ser mayor a 100' })
  @IsOptional()
  @Type(() => Number)
  limit?: number;
}
