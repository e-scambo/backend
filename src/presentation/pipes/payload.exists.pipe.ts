import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class PayloadPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value || Object.keys(value).length < 1) {
      throw new BadRequestException('The request payload shall not be empty');
    }
    return value;
  }
}