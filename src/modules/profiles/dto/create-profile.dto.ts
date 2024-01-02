export class CreateProfileDTO {
  id: string;
  userID: string;
  firstName: string;
  lastName: string;

  imageID: string;

  bio: string;
  gender: string;

  sex: Enumerator<"MALE" | "FEMALE" | "RNTS">;
}
