export type ProductoNuevo = {
  id: string;             // UUID o timestamp string
  nombre: string;
  codigo?: string;
  cantidad?: number;      // Opcional, porque un producto puede no tener stock definido
  precio: number;
  descripcion?: string;
  url_img?: string;       // URL o path relativo de imagen
};

export type Venta = {
  id: string;             // UUID
  fecha: string;          // Fecha en formato ISO 8601 (ejemplo: "2025-07-06T15:00:00Z")
  total: number;          // Total en dinero (puede ser decimal)
  cantidad_total: number; // Total de productos vendidos
};

export type DetalleVenta = {
  id: string;             // UUID
  venta_id: string;       // FK a Venta
  producto_id: string;    // FK a ProductoNuevo
  nombre: string;
  codigo: string;
  cantidad: number;
  subtotal: number;       // subtotal = cantidad * precio unitario
};

export type Negocio = {
  id: string;             // UUID
  nombre: string;
};
