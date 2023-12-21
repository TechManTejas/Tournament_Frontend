import { IUser } from "./user.types";

export interface IMedia {
    id: number;
    user: IUser;
    name: string;
    image: string;
    type: string;
    category: string;
    verified: boolean;
}
