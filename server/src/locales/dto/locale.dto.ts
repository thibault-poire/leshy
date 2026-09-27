import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class LocaleDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(5)
  code: string;
}
