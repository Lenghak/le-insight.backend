import { IsString } from "class-validator";

export class CreateProfileDTO {
  // id: string;
  // userID: string;
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  // imageID: string;

  // bio: string;
  // gender: string;

  // sex: "MALE" | "FEMALE" | "RNTS";
}
