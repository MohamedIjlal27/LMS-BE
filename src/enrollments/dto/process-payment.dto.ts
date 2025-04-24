import { IsNotEmpty, IsString, IsNumber, IsCreditCard, IsDateString } from 'class-validator';

export class ProcessPaymentDto {
  @IsNotEmpty()
  @IsString()
  @IsCreditCard()
  cardNumber: string;

  @IsNotEmpty()
  @IsString()
  cardHolderName: string;

  @IsNotEmpty()
  @IsDateString()
  expiryDate: string;

  @IsNotEmpty()
  @IsNumber()
  cvv: number;

  @IsNotEmpty()
  @IsString()
  paymentMethod: string;
} 