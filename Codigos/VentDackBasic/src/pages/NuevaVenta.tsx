import { Fragment, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navegacion from "../components/Navegacion";
import Header from "../components/Header";
import TarjetaProducto from "../components/TarjetaProducto";
import TarjetaProductoVenta from "../components/TarjetaProductoVenta";
import { useProduct } from "../hooks/useProduct";
import type { ProductoNuevo,DetalleVenta } from "../types/models_types";
import "../styles/NuevaVenta.css";
import ModalError from "../components/ModalError";
import ModalExito from "../components/ModalExito";
import { Modal, Button, Spinner } from "react-bootstrap";

export default function NuevaVenta() {
  const { productos } = useProduct();
  const [productosDisponibles, setProductosDisponibles] = useState<ProductoNuevo[]>([]);
  const [productosBuscados, setProductosBuscados] = useState<ProductoNuevo[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [productosTicket, setProductosTicket] = useState<ProductoNuevo[]>([]);

  const [modalGuardarVenta, setModalGuardarVenta] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [modalExito, setModalExito] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (productos) {
      setProductosDisponibles([...productos]);
      const filtrados = busqueda
        ? productos.filter(p =>
          p.nombre.toLowerCase().startsWith(busqueda.toLowerCase()) ||
          p.codigo?.startsWith(busqueda)
        )
        : productos;
      setProductosBuscados(filtrados);
    }
  }, [productos, busqueda]);

  const total = useMemo(() =>
    productosTicket.reduce(
      (total, item) =>
        total + (Number(item.cantidad ?? 0) * Number(item.precio ?? 0)),
      0
    ),
    [productosTicket]
  );

  const buscar = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusqueda(e.target.value);
  };

  const guardarVenta = async () => {
  if (productosTicket.length === 0) {
    setModalGuardarVenta(false);
    setErrorMsg("No hay productos en el ticket.");
    setModalError(true);
    return;
  }

  setCargando(true);
  try {
    const idVenta = crypto.randomUUID();
    const fecha = new Date().toISOString();
    const cantidad_total = productosTicket.reduce((acc, p) => acc + (p.cantidad ?? 0), 0);

    const venta = {
      id: idVenta,
      fecha,
      total,
      cantidad_total,
    };

    await window.api.crearVenta(venta);

    for (const producto of productosTicket) {
      const cantidadVendida = producto.cantidad ?? 1;

      const detalle: DetalleVenta = {
        id: crypto.randomUUID(),
        venta_id: idVenta,             // importante: id de la venta
        producto_id: producto.id,      // importante: id del producto
        nombre: producto.nombre,
        codigo: producto.codigo ?? "",
        cantidad: cantidadVendida,
        subtotal: cantidadVendida * (producto.precio ?? 0),
      };

      await window.api.crearDetalleVenta(detalle);

      // Actualizar cantidad del producto
      const original = productos.find(p => p.id === producto.id);
      if (original) {
        const actualizado = {
          ...original,
          cantidad: Math.max((original.cantidad ?? 0) - cantidadVendida, 0),
        };
        await window.api.editarProducto(actualizado);
      }
    }

    setCargando(false);
    setModalGuardarVenta(false);
    setProductosTicket([]);
    setModalExito(true);
  } catch (error: any) {
    setCargando(false);
    setModalGuardarVenta(false);
    setErrorMsg(error?.message || "Ocurrió un error al guardar la venta.");
    setModalError(true);
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
          <Navegacion pagina="NuevaVenta" />
        </aside>
        <section>
          <Header pagina="Nueva Venta" />
          <div className="generar-nueva-venta">
            <div className="botones-elementales">
              <div className="buscador">
                <div className="buscar">
                  <img src="/img/icono_search.png" alt="" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar"
                  value={busqueda}
                  onChange={buscar}
                />
              </div>
            </div>

            <div className="contenedores-venta">
              <div className="contenedor-productos">
                {productosBuscados
                  .filter(producto => (producto.cantidad ?? 0) > 0)
                  .map(producto => (
                    <TarjetaProducto
                      key={producto.id}
                      producto={producto}
                      productos={productos}
                      productosTicket={productosTicket}
                      setProductosTicket={setProductosTicket}
                    />
                  ))}
              </div>

              <div className="contenedor-venta">
                {productosTicket.map(producto => (
                  <TarjetaProductoVenta
                    key={producto.id}
                    nombre={producto.nombre}
                    precio={producto.precio}
                    cantidad={producto.cantidad ?? 1}
                    productosTicket={productosTicket}
                    setProductosTicket={setProductosTicket}
                  />
                ))}
              </div>
            </div>

            <div
              className="generar-venta"
              style={{ cursor: "pointer" }}
              onClick={() => setModalGuardarVenta(true)}
            >
              <p>${total.toFixed(2)}</p>
              <img src="/img/icono_recibo.png" alt="Guardar venta" />
            </div>
          </div>
        </section>
      </main>

      <Modal
        show={modalGuardarVenta}
        onHide={() => setModalGuardarVenta(false)}
        size="lg"
        centered
        backdrop={cargando ? "static" : true}
        keyboard={!cargando}
      >
        <Modal.Header closeButton={!cargando}>
          <Modal.Title>¿Confirmar venta?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Deseas guardar esta venta con los productos seleccionados?</p>
          {cargando && (
            <div className="d-flex align-items-center">
              <Spinner animation="border" className="me-2" />
              <span>Guardando venta, por favor espera...</span>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalGuardarVenta(false)} disabled={cargando}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={guardarVenta} disabled={cargando}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      <ModalError
        body={errorMsg}
        show={modalError}
        onHide={() => setModalError(false)}
      />

      <ModalExito
        body="Venta guardada exitosamente."
        show={modalExito}
        onHide={cerrarExito}
      />
    </Fragment>
  );
}
