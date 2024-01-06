import { IClub } from "./club.types";

export interface ITournament {
  id: number;
  game_mode: GameMode;
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
  status: string;
}

export interface GameMode {
  id: number;
  name: string;
  description: string;
  data: JSON;
}
