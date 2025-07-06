export type ProductoNuevo = {
  id: string;             // UUID o timestamp string
  nombre: string;
  codigo?: string;
  cantidad?: number;
  precio: number;
  descripcion?: string;
  url_img?: string;
} 
export type Venta = {
  id: string;           // UUID
  fecha: string;        // ISO string
  total: number;        // Total en dinero
  cantidad_total: number; // Nueva propiedad: total de productos vendidos
}

export type DetalleVenta = {
  id: string;
  venta_id: string;
  nombre: string;
  codigo: string;
  cantidad: number;
  subtotal: number;
};