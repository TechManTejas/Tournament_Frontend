import { IClub } from "./club.types";
import { IRound } from "./round.types";
import { ITeamRecord } from "./team.types";
import { ITournament } from "./tournament.types";

export interface IGroupTeam {
  id: number;
  team_record: ITeamRecord;
  points: number;
  goals_pos: number;
  goals_neg: number;
  order: number;
}

export interface IGroup {
  id: number;
  club: IClub;
  tournament: ITournament;
  round: IRound;
  group_team_records: IGroupTeam[];
  name: string;
}