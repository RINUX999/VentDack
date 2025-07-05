export default interface Venta{
    id: string;           // UUID
    fecha: string;        // ISO string, puede venir de SQLite como '2024-07-05T13:45:00'
    total: number;
}