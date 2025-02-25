import { ArgumentMetadata, BadRequestException, Injectable, ParseIntPipe, PipeTransform } from '@nestjs/common';

@Injectable()
export class IdValidationPipe extends ParseIntPipe {
  constructor(){
    super({
      exceptionFactory: (param: string) => {
        return new BadRequestException(`Id must be a number`);
      }
    })
  }
}
