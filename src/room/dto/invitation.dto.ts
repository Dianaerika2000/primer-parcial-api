import { IsString } from "class-validator";

export class InvitationDto {
  @IsString()
  invitationToken: string;

  @IsString()
  jwt: string;
}