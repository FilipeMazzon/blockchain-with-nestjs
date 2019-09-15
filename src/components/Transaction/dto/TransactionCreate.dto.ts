import { IsNotEmpty, IsString } from 'class-validator';

export class TransactionCreateDto {
  @IsNotEmpty({ message: 'Campo obrigatório' })
  @IsString({ message: 'Campo precisa ser string' })
  identification: string;

  [propName: string]: any;
}
