import { IClub } from "./club.types";

export interface IReferee {
    id: number;
    club: IClub;
    name: string;
}