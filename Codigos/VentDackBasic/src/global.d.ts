export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  creado_en: string;
}

declare global {
  interface Window {
    api: {
      obtenerProductos: () => Promise<Producto[]>;
      insertarProducto: (nombre: string, precio: number) => Promise<void>;
    };
  }
}
