import { Fragment, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navegacion from "../components/Navegacion";
import Header from "../components/Header";
import InfoVenta from "../components/InfoVenta";
import type { Venta } from "../types/models_types";
import { useVentas } from "../hooks/useVenta";

import "../styles/Venta.css";

const meses = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export default function Venta() {
  const location = useLocation();
  const navigate = useNavigate();
  const { detalles, cargarDetalles } = useVentas();

  const venta: Venta | undefined = location.state?.venta;

  if (!venta) {
    navigate("/Ventas");
    return null;
  }

  useEffect(() => {
    cargarDetalles();
  }, [cargarDetalles]);

  const fechaObj = new Date(venta.fecha);
  const dia = fechaObj.getDate();
  const mes = meses[fechaObj.getMonth()];
  const año = fechaObj.getFullYear();

  let hora = fechaObj.getHours();
  const minutos = fechaObj.getMinutes().toString().padStart(2, "0");
  const ampm = hora >= 12 ? "PM" : "AM";
  hora = hora % 12;
  if (hora === 0) hora = 12;
  const horaFormateada = `${hora}:${minutos} ${ampm}`;

  // Filtramos los detalles que pertenecen a esta venta
  const detallesFiltrados = detalles.filter(detalle => detalle.venta_id === venta.id);

  return (
    <Fragment>
      <main>
        <aside>
          <Navegacion pagina="Venta" />
        </aside>
        <section>
          <Header pagina="Venta" />
          <div className="venta">
            <p>
              Fecha: {dia} / {mes} / {año} &nbsp;&nbsp; Hora: {horaFormateada}
            </p>

            <div className="productos-venta">
              <div className="elemento">
                <div className="caracteristica"><p>Producto:</p></div>
                <div className="caracteristica"><p>Precio:</p></div>
                <div className="caracteristica"><p>Cantidad:</p></div>
                <div className="caracteristica"><p>Total:</p></div>
              </div>

              {detallesFiltrados.length === 0 && <p>No hay detalles para esta venta.</p>}

              {detallesFiltrados.map((detalle) => (
                <InfoVenta
                  key={detalle.id}
                  producto={detalle.nombre}
                  precio={detalle.subtotal / detalle.cantidad}
                  cantidad={detalle.cantidad}
                  total={detalle.subtotal}
                />
              ))}
            </div>

            <div className="opciones-venta">
              <div className="editar">
                <p>Eliminar Venta</p>
                <p>Cancelar Venta</p>
              </div>
              <div className="total">
                <p>Total: ${venta.total.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Fragment>
  );
}
