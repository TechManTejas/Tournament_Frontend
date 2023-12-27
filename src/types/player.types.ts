export interface IPlayer {
    id: number;
    name: string;
    image: string;
    squad_number: number;
    display_order: number;
    status: 'First Eleven' | 'Substitute';
}