import { IMedia } from "./media.types";

export interface IClub {
  name: string;
  logo: IMedia | null;
  address: string;
}
