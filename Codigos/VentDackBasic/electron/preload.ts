import { contextBridge, ipcRenderer } from "electron";

import type ProductoNuevo from "./db/models/ProductoVenta";
import type Venta from "./db/models/Venta";
import type DetalleVenta from "./db/models/DetalleVenta";

contextBridge.exposeInMainWorld("api", {
  // Productos
  obtenerProductos: (): Promise<ProductoNuevo[]> =>
    ipcRenderer.invoke("producto:obtenerTodos"),

  obtenerProductoPorId: (id: string): Promise<ProductoNuevo | null> =>
    ipcRenderer.invoke("producto:obtenerPorId", id),

  crearProducto: (producto: ProductoNuevo): Promise<void> =>
    ipcRenderer.invoke("producto:crear", producto),

  editarProducto: (producto: ProductoNuevo): Promise<void> =>
    ipcRenderer.invoke("producto:editar", producto),

  eliminarProducto: (id: string): Promise<void> =>
    ipcRenderer.invoke("producto:eliminar", id),

  eliminarProductos: (ids: string[]): Promise<void> =>
    ipcRenderer.invoke("producto:eliminarVarios", ids),

  // Ventas
  crearVenta: (venta: Venta): Promise<void> =>
    ipcRenderer.invoke("venta:crear", venta),

  obtenerVentas: (): Promise<Venta[]> =>
    ipcRenderer.invoke("venta:obtenerTodas"),

  obtenerVentaPorId: (id: string): Promise<Venta | null> =>
    ipcRenderer.invoke("venta:obtenerPorId", id),

  eliminarVenta: (id: string): Promise<void> =>
    ipcRenderer.invoke("venta:eliminar", id),

  // DetalleVentas
  crearDetalleVenta: (detalle: DetalleVenta): Promise<void> =>
    ipcRenderer.invoke("detalleVenta:crear", detalle),

  obtenerDetallesPorVentaId: (ventaId: string): Promise<DetalleVenta[]> =>
    ipcRenderer.invoke("detalleVenta:obtenerPorVentaId", ventaId),

  eliminarDetalleVenta: (id: string): Promise<void> =>
    ipcRenderer.invoke("detalleVenta:eliminar", id),
 
  obtenerDetalles: (): Promise<DetalleVenta[]> =>
    ipcRenderer.invoke("detalleVenta:obtenerTodos"),

  // Imágenes
  guardarImagenBuffer: (
    buffer: Uint8Array,
    nombreArchivo: string
  ): Promise<string | null> =>
    ipcRenderer.invoke("imagen:guardarBuffer", buffer, nombreArchivo),

  eliminarImagen: (ruta: string): Promise<boolean> =>
    ipcRenderer.invoke("imagen:eliminar", ruta),
});
