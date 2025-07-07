import { contextBridge, ipcRenderer } from 'electron';
import type ProductoNuevo from './db/models/ProductoVenta';
import type Venta from './db/models/Venta';
import type DetalleVenta from './db/models/DetalleVenta';

contextBridge.exposeInMainWorld('api', {
  // --- PRODUCTOS ---
  obtenerProductos: (): Promise<ProductoNuevo[]> =>
    ipcRenderer.invoke('producto:obtenerTodos'),

  obtenerProductoPorId: (id: string): Promise<ProductoNuevo | null> =>
    ipcRenderer.invoke('producto:obtenerPorId', id),

  crearProducto: (producto: ProductoNuevo): Promise<void> =>
    ipcRenderer.invoke('producto:crear', producto),

  editarProducto: (producto: ProductoNuevo): Promise<void> =>
    ipcRenderer.invoke('producto:editar', producto),

  eliminarProducto: (id: string): Promise<void> =>
    ipcRenderer.invoke('producto:eliminar', id),

  eliminarProductos: (ids: string[]): Promise<void> =>
    ipcRenderer.invoke('producto:eliminarVarios', ids),

  // --- VENTAS ---
  crearVenta: (venta: Venta): Promise<void> =>
    ipcRenderer.invoke('venta:crear', venta),

  obtenerVentas: (): Promise<Venta[]> =>
    ipcRenderer.invoke('venta:obtenerTodas'),

  obtenerVentaPorId: (id: string): Promise<Venta | null> =>
    ipcRenderer.invoke('venta:obtenerPorId', id),

  eliminarVenta: (id: string): Promise<void> =>
    ipcRenderer.invoke('venta:eliminar', id),

  // --- DETALLES DE VENTA ---
  crearDetalleVenta: (detalle: DetalleVenta): Promise<void> =>
    ipcRenderer.invoke('detalleVenta:crear', detalle),

  obtenerDetallesPorVentaId: (ventaId: string): Promise<DetalleVenta[]> =>
    ipcRenderer.invoke('detalleVenta:obtenerPorVentaId', ventaId),

  obtenerDetalles: (): Promise<DetalleVenta[]> =>
    ipcRenderer.invoke('detalleVenta:obtenerTodos'),

  eliminarDetalleVenta: (id: string): Promise<void> =>
    ipcRenderer.invoke('detalleVenta:eliminar', id),

  // --- IMÁGENES ---
  guardarImagenBuffer: (
    buffer: Uint8Array,
    nombreArchivo: string
  ): Promise<string | null> =>
    ipcRenderer.invoke('imagen:guardarBuffer', buffer, nombreArchivo),

  eliminarImagen: (ruta: string): Promise<boolean> =>
    ipcRenderer.invoke('imagen:eliminar', ruta),

  // --- NEGOCIO ---
  obtenerNegocio: (): Promise<{ id: string; nombre: string } | null> =>
    ipcRenderer.invoke('negocio:obtener'),

  guardarNegocio: (nombre: string): Promise<void> =>
    ipcRenderer.invoke('negocio:guardar', nombre),

  editarNegocio: (id: string, nuevoNombre: string): Promise<void> =>
    ipcRenderer.invoke('negocio:editar', id, nuevoNombre),

  eliminarNegocio: (id: string): Promise<void> =>
    ipcRenderer.invoke('negocio:eliminar', id),

  // --- IMPORTAR / EXPORTAR SQL ---
  importarSQL: (): Promise<void> =>
    ipcRenderer.invoke('importarSQL'),

  exportarSQL: (): Promise<void> =>
    ipcRenderer.invoke('exportarSQL'),

  // --- CÓDIGOS DE DESBLOQUEO ---
  obtenerCodigosRenta: (): Promise<
    { fecha: string; codigo: string }[] | null
  > => ipcRenderer.invoke('codigos:obtener'),
});
