import { InputType, Int, Field, Float } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

@InputType()
export class CreateItemInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field(() => Float)
  @IsPositive()
  @Min(1)
  quantity: number;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  quantityUnits?: string;
}
