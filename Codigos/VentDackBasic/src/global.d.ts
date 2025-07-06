import type ProductoNuevo from './types/models_types';
import type Venta from './models/Venta';
import type DetalleVenta from './models/DetalleVenta';

declare global {
  interface Window {
    api: {
      // Productos
      guardarImagen: (rutaOriginal: string) => Promise<string>;
      guardarImagenBuffer: (buffer: Uint8Array, nombreArchivo: string) => Promise<string | null>;
      obtenerProductos: () => Promise<ProductoNuevo[]>;
      obtenerProductoPorId: (id: string) => Promise<ProductoNuevo | null>;
      crearProducto: (producto: ProductoNuevo) => Promise<void>;
      editarProducto: (producto: ProductoNuevo) => Promise<void>;
      eliminarProducto: (id: string) => Promise<void>;
      eliminarProductos: (ids: string[]) => Promise<void>;
      eliminarImagen: (ruta: string) => Promise<boolean>;

      // Ventas
      crearVenta: (venta: Venta) => Promise<void>;
      obtenerVentas: () => Promise<Venta[]>;
      obtenerVentaPorId: (id: string) => Promise<Venta | null>;
      eliminarVenta: (id: string) => Promise<void>;

      // DetalleVentas
      crearDetalleVenta: (detalleVenta: DetalleVenta) => Promise<void>;
      obtenerDetalles: () => Promise<DetalleVenta[]>; // ✅ Traer todos los detalles
      eliminarDetalleVenta: (id: string) => Promise<void>;
    };
  }
}

export {};
