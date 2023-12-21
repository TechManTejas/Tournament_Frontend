import { IMedia } from "./media.types";
import { ITeam } from "./team.types";

export interface IPlayer {
    id: number;
    team: ITeam;
    name: string;
    image: IMedia;
    squad_number: number;
    display_order: number;
    status: 'First Eleven' | 'Substitute';
}