import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Venta, DetalleVenta } from "../types/models_types";
import { useVentas } from "../hooks/useVenta";

const meses = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

type TarjetaVentaProps = {
  venta: Venta;
};

export default function TarjetaVenta({ venta }: TarjetaVentaProps) {
  const { detalles } = useVentas();

  // Estado local para detalles filtrados de esta venta
  const [detallesVenta, setDetallesVenta] = useState<DetalleVenta[]>([]);

  // Filtrar detalles para esta venta cuando detalles cambien o venta cambie
  useEffect(() => {
    const filtrados = detalles.filter(d => d.ventaId === venta.id);
    setDetallesVenta(filtrados);
  }, [detalles, venta]);

  const { total, cantidad_total, fecha } = venta;

  const fechaObj = new Date(fecha);
  const dia = fechaObj.getDate();
  const mes = meses[fechaObj.getMonth()];
  const año = fechaObj.getFullYear();

  let hora = fechaObj.getHours();
  const minutos = fechaObj.getMinutes().toString().padStart(2, "0");
  const ampm = hora >= 12 ? "PM" : "AM";
  hora = hora % 12;
  if (hora === 0) hora = 12;

  return (
    <Fragment>
      <Link to="/Venta" state={{ venta, detalles: detallesVenta }} className="link">
        <div className="contenedor-venta">
          <p>Total: $ {total.toFixed(2)}</p>
          <div className="descripcion-venta">
            <p>Productos Vendidos: {cantidad_total}</p>
            <p>Fecha: {dia} / {mes} / {año}</p>
            <p>Hora: {hora}:{minutos} {ampm}</p>
          </div>
        </div>
      </Link>
    </Fragment>
  );
}
