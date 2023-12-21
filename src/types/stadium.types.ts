import { IClub } from './club.types';

export interface IStadium {
  id: number;
  club: IClub; 
  name: string;
  image: string;
  address: string;
}
