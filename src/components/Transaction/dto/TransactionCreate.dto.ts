import {IsNotEmpty, IsString} from 'class-validator';

export class TransactionCreateDto {
  @IsNotEmpty({message: 'Campo obrigatório'})
  @IsString({message: 'Campo precisa ser string'})
  recipient: string;

  @IsNotEmpty({message: 'Campo obrigatório'})
  @IsString({message: 'Campo precisa ser string'})
  amount: string;
}
