import { IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  name: string;
  @IsOptional()
  phone: string;
  @IsOptional()
  address: string;
  @IsOptional()
  image: string;
}
