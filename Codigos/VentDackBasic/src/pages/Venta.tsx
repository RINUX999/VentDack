import { Fragment, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navegacion from "../components/Navegacion";
import Header from "../components/Header";
import InfoVenta from "../components/InfoVenta";
import type { Venta } from "../types/models_types";
import { useVentas } from "../hooks/useVenta";

import ModalExito from "../components/ModalExito";
import ModalAdvertencia from "../components/ModalAdvertencia";
import ModalError from "../components/ModalError";

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

  // Estados para modales y carga
  const [modalEliminar, setModalEliminar] = useState(false);
  const [modalCancelar, setModalCancelar] = useState(false);
  const [modalExito, setModalExito] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [cargando, setCargando] = useState(false);

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

  // Detalles de esta venta
  const detallesFiltrados = detalles.filter(detalle => detalle.venta_id === venta.id);

  // Función para eliminar venta y sus detalles
  const eliminarVenta = async () => {
    setCargando(true);
    try {
      for (const detalle of detallesFiltrados) {
        await window.api.eliminarDetalleVenta(detalle.id);
      }
      await window.api.eliminarVenta(venta.id);

      setCargando(false);
      setModalEliminar(false);
      setModalExito(true);
    } catch (error: any) {
      setCargando(false);
      setErrorMsg(error?.message || "Error al eliminar la venta.");
      setModalError(true);
      setModalEliminar(false);
    }
  };

  // Función para cancelar venta y devolver cantidades a productos
  const cancelarVenta = async () => {
    setCargando(true);
    try {
      // Por cada detalle, obtener producto original y actualizar cantidad sumando la cancelación
      for (const detalle of detallesFiltrados) {
        const productoOriginal = await window.api.obtenerProductoPorId(detalle.producto_id);
        if (productoOriginal) {
          const cantidadActualizada = (productoOriginal.cantidad ?? 0) + detalle.cantidad;
          const actualizado = { ...productoOriginal, cantidad: cantidadActualizada };
          await window.api.editarProducto(actualizado);
        }
        // Además, eliminar el detalle de venta cancelada
        await window.api.eliminarDetalleVenta(detalle.id);
      }
      // Finalmente, eliminar la venta misma
      await window.api.eliminarVenta(venta.id);

      setCargando(false);
      setModalCancelar(false);
      setModalExito(true);
    } catch (error: any) {
      setCargando(false);
      setErrorMsg(error?.message || "Error al cancelar la venta.");
      setModalError(true);
      setModalCancelar(false);
    }
  };

  const cerrarExito = () => {
    setModalExito(false);
    navigate("/Ventas");
  };

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
              <div className="editar" style={{ cursor: "pointer" }}>
                <p onClick={() => setModalEliminar(true)}>Eliminar Venta</p>
                <p onClick={() => setModalCancelar(true)}>Cancelar Venta</p>
              </div>
              <div className="total">
                <p>Total: ${venta.total.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Modal Confirmación Eliminar Venta */}
      <ModalAdvertencia
        titulo="¿Confirmar eliminación?"
        body="¿Estás seguro que deseas eliminar esta venta y todos sus detalles?"
        textBoton="Eliminar"
        show={modalEliminar}
        onHide={() => !cargando && setModalEliminar(false)}
        onConfirmar={eliminarVenta}
        loading={cargando}
      />

      {/* Modal Confirmación Cancelar Venta */}
      <ModalAdvertencia
        titulo="¿Confirmar cancelación?"
        body="¿Deseas cancelar esta venta? Esto devolverá las cantidades de los productos al inventario."
        textBoton="Cancelar venta"
        show={modalCancelar}
        onHide={() => !cargando && setModalCancelar(false)}
        onConfirmar={cancelarVenta}
        loading={cargando}
      />

      {/* Modal Exito */}
      <ModalExito
        body="Operación realizada exitosamente."
        show={modalExito}
        onHide={cerrarExito}
      />

      {/* Modal Error */}
      <ModalError
        body={errorMsg}
        show={modalError}
        onHide={() => setModalError(false)}
      />
    </Fragment>
  );
}
