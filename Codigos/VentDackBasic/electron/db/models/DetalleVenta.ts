export default interface DetalleVenta{
  id: string;           // UUID
  venta_id: string;     // FK a Venta
  producto_id: string;  // FK a ProductoVenta
  cantidad: number;
  subtotal: number;     // cantidad * precio del momento
};