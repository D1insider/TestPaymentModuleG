import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?!0+(?:\.0{1,2})?$)\d+(?:\.\d{1,2})?$/, { message: 'amount должна быть положительной суммой с точностью до копеек' })
  amount!: string;

  @IsString()
  @Length(3, 100)
  @Matches(/^[A-Za-z0-9._:-]+$/, { message: 'idempotencyKey содержит недопустимые символы' })
  idempotencyKey!: string;
}
