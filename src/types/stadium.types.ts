import { IClub } from './club.types';
import { IMedia } from './media.types';

export interface IStadium {
  id: number;
  club: IClub; 
  name: string;
  image: IMedia;
  address: string;
}
