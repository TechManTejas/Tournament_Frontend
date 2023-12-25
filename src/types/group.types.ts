import { IClub } from "./club.types";
import { IRound } from "./round.types";
import { ITeamRecord } from "./team.types";
import { ITournament } from "./tournament.types";

export interface IGroup {
    id: number;
    club: IClub;
    tournament: ITournament;
    round: IRound;
    team_records: Array<ITeamRecord>;
    name: string;
  }
  