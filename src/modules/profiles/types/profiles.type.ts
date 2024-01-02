import { type SexEnum } from "./profiles.enum";

export type Profiles = {
  id: string;
  first_name: string;
  last_name: string;
  image_id: string;

  bio: string;
  gender: string;
  sex: SexEnum;
};
