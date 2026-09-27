import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class PlantDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  binomial_name: string;
}
