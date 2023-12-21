import { IClub } from "./club.types";
import { IMedia } from "./media.types";

export interface ITeam {
    id: number;
    club: IClub;
    name: string;
    short_name: string;
    logo: IMedia | null;
    category: string;
    verified: boolean;
  }