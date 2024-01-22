import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateOpenaiDto {
  @IsString()
  @IsOptional()
  xmlDiagram: string;

  @IsString()
  programmingLanguage: string;

  @IsNumber()
  @IsOptional()
  roomId: number;
}
