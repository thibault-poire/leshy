import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class AddPlantDto {
  @IsString()
  @IsNotEmpty()
  binomial_name: string;
}

export class UpdatePlantDto extends AddPlantDto {}

export class PatchPlantDto {
  @IsString()
  @IsOptional()
  binomial_name?: string;
}
