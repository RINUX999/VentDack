import type { ProductoNuevo } from "./types/models_types";

declare global {
  interface Window {
    api: {
      guardarImagen: (rutaOriginal: string) => Promise<string>;
      guardarImagenBuffer: (buffer: Uint8Array, nombreArchivo: string) => Promise<string | null>;  // <-- agregado
      obtenerProductos: () => Promise<ProductoNuevo[]>;
      obtenerProductoPorId: (id: string) => Promise<ProductoNuevo | null>;
      crearProducto: (producto: ProductoNuevo) => Promise<void>;
      editarProducto: (producto: ProductoNuevo) => Promise<void>;
      eliminarProducto: (id: string) => Promise<void>;
      eliminarProductos: (ids: string[]) => Promise<void>;
      eliminarImagen: (ruta: string) => Promise<boolean>;
    };
  }
}
