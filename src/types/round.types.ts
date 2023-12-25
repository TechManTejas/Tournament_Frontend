/* eslint-disable @typescript-eslint/no-explicit-any */
import { IClub } from "./club.types";
import { ITournament } from "./tournament.types";

export interface IRound {
    id: number;
    club: IClub;
    tournament: ITournament;
    name: string;
    schedule: any[]; 
    result: any[];   
}
