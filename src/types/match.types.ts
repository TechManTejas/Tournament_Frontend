import { IPlayer } from "./player.types";
import { IReferee } from "./referee.types";
import { IStadium } from "./stadium.types";
import { ITeam } from "./team.types";
import { ITournament } from "./tournament.types";

export interface IMatch {
    id: number;
    teamA: ITeam;
    teamB: ITeam;
    jersey_color_A: string;
    jersey_color_B: string;
    tournament: ITournament;
    datetime: string;
    referee_head: IReferee;
    referee_assistant: IReferee | null;
    referee_assistant_2: IReferee | null;
    referee_assistant_3: IReferee | null;
    stadium: IStadium;
    status: 'scheduled' | 'in_progress' | 'completed';
    start_time: string;
    timer: string;
    end_time: string;
}

export interface IMatchSubstituteRecord {
    id: number;
    match: IMatch;
    player_in: IPlayer;
    player_out: IPlayer;
    minute: number;
    created_at: string; 
}

export interface IMatchCardRecord {
    id: number;
    match: IMatch;
    player: IPlayer;
    card_type: 'red' | 'yellow' | 'time';
    penalty_time: number | null;
    minute: number;
    created_at: string; 
}

export interface IMatchGoalRecord {
    id: number;
    match: IMatch;
    player: IPlayer;
    goal_minute: number;
    is_penalty_goal: boolean;
    is_own_goal: boolean;
    created_at: string; 
}

export interface IMatchComment {
    id: number;
    match: IMatch;
    comment_minute: number;
    comment: string;
    type: 'normal' | 'goal' | 'substitution' | 'card' | 'other';
    created_at: string; 
}