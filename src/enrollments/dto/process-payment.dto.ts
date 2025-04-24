import { IsNotEmpty, IsString, IsNumber, IsCreditCard, IsDateString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty({
    description: 'Payment method',
    example: 'credit_card',
    enum: ['credit_card', 'paypal', 'bank_transfer']
  })
  @IsString()
  paymentMethod: string;

  @ApiProperty({
    description: 'Payment amount',
    example: 99.99,
    minimum: 0
  })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({
    description: 'Payment transaction ID',
    example: 'txn_1234567890'
  })
  @IsString()
  transactionId: string;
} 