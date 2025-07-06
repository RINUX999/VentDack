import type ProductoNuevo from './types/models_types';
import type Venta from './models/Venta';
import type DetalleVenta from './models/DetalleVenta';
import type { Negocio } from './models/Negocio';

declare global {
  interface Window {
    api: {
      // Imágenes
      guardarImagenBuffer: (buffer: Uint8Array, nombreArchivo: string) => Promise<string | null>;
      eliminarImagen: (ruta: string) => Promise<boolean>;

      // Productos
      obtenerProductos: () => Promise<ProductoNuevo[]>;
      obtenerProductoPorId: (id: string) => Promise<ProductoNuevo | null>;
      crearProducto: (producto: ProductoNuevo) => Promise<void>;
      editarProducto: (producto: ProductoNuevo) => Promise<void>;
      eliminarProducto: (id: string) => Promise<void>;
      eliminarProductos: (ids: string[]) => Promise<void>;

      // Ventas
      crearVenta: (venta: Venta) => Promise<void>;
      obtenerVentas: () => Promise<Venta[]>;
      obtenerVentaPorId: (id: string) => Promise<Venta | null>;
      eliminarVenta: (id: string) => Promise<void>;

      // Detalles de venta
      crearDetalleVenta: (detalleVenta: DetalleVenta) => Promise<void>;
      obtenerDetalles: () => Promise<DetalleVenta[]>;
      obtenerDetallesPorVentaId: (ventaId: string) => Promise<DetalleVenta[]>;
      eliminarDetalleVenta: (id: string) => Promise<void>;

      // Negocio
      obtenerNegocio: () => Promise<Negocio | null>;
      guardarNegocio: (nombre: string) => Promise<void>;
      editarNegocio: (id: string, nuevoNombre: string) => Promise<void>;
      eliminarNegocio: (id: string) => Promise<void>;

      // Importar / Exportar SQL
      importarSQL?: () => Promise<void>;
      exportarSQL?: () => Promise<void>;
    };
  }
}

export {};
