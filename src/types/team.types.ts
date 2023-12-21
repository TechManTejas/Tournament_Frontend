import { IClub } from "./club.types";

export interface ITeam {
    id: number;
    club: IClub;
    name: string;
    short_name: string;
    logo: string;
    category: string;
    verified: boolean;
  }