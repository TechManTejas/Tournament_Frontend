import { IClub } from "./club.types";
import { IPlayer } from "./player.types";

export interface ITeamRecord {
  id: number;
  club: IClub;
  logo: string; 
  name: string;
  short_name: string;
  category: string;
  verified: boolean;
  playing_player_1: IPlayer;
  playing_player_2: IPlayer;
  playing_player_3: IPlayer;
  playing_player_4: IPlayer;
  playing_player_5: IPlayer;
  playing_player_6: IPlayer;
  playing_player_7: IPlayer;
  playing_player_8: IPlayer;
  playing_player_9: IPlayer;
  playing_player_10: IPlayer;
  playing_player_11: IPlayer;
  substitute_player_1: IPlayer;
  substitute_player_2: IPlayer;
  substitute_player_3: IPlayer;
  substitute_player_4: IPlayer;
  substitute_player_5: IPlayer;
  points: number;
  goals_pos: number;
  goals_neg: number;
  save_team: boolean;
}