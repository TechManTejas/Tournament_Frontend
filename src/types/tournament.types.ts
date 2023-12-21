import { IClub } from "./club.types";
export interface ITournament {
    id: number;
    club: IClub;
    name: string;
    alias: string;
    logo: string;
    points_draw: number;
    start_time: string; 
    start_date: string;
    no_of_teams: number;
    no_of_groups: number;
    playing_time: number;
    pause_between_games: number;
    points_winner: number;
    points_defeat: number;
    timer: string;
  }
  