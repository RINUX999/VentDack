import type { ProductoNuevo } from "./types/models_types";

declare global {
  interface Window {
    api: {
      obtenerProductos: () => Promise<ProductoNuevo[]>;
      obtenerProductoPorId: (id: string) => Promise<ProductoNuevo | null>;
      crearProducto: (producto: ProductoNuevo) => Promise<void>;         
      editarProducto: (producto: ProductoNuevo) => Promise<void>;
      eliminarProducto: (id: string) => Promise<void>;
      eliminarProductos: (ids: string[]) => Promise<void>;
    };
  }
}
