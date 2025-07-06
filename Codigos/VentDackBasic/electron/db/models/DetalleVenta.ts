export default interface DetalleVenta {
  id: string;
  venta_id: string;
  producto_id: string; // nuevo campo
  nombre: string;
  codigo: string;
  cantidad: number;
  subtotal: number;
}
