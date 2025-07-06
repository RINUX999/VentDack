import { Fragment, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navegacion from "../components/Navegacion";
import Header from "../components/Header";
import TarjetaProducto from "../components/TarjetaProducto";
import TarjetaProductoVenta from "../components/TarjetaProductoVenta";
import { useProduct } from "../hooks/useProduct";
import type { ProductoNuevo } from "../types/models_types";
import "../styles/NuevaVenta.css";
import ModalAdvertencia from "../components/ModalAdvertencia";
import ModalError from "../components/ModalError";

export default function NuevaVenta() {
  const { productos } = useProduct();
  const [productosDisponibles, setProductosDisponibles] = useState<ProductoNuevo[]>([]);
  const [productosBuscados, setProductosBuscados] = useState<ProductoNuevo[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [productosTicket, setProductosTicket] = useState<ProductoNuevo[]>([]);
  const [modalConfirmacionGuardar, setModalConfirmacionGuardar] = useState(false);
  const [modalErrorNoProductos, setModalErrorNoProductos] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (productos) {
      setProductosDisponibles([...productos]);
      if (busqueda && busqueda !== "") {
        const productosB = productos.filter(producto =>
          producto.nombre.toLowerCase().startsWith(busqueda.toLowerCase()) ||
          producto.codigo?.startsWith(busqueda)
        );
        setProductosBuscados([...productosB]);
      } else {
        setProductosBuscados([...productos]);
      }
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
    try {
      if (productosTicket.length === 0) {
        setModalConfirmacionGuardar(false);
        setModalErrorNoProductos(true);
        return;
      }

      const idVenta = crypto.randomUUID();
      const fecha = new Date().toISOString();
      const totalVenta = total;

      const cantidad_total = productosTicket.reduce(
        (acc, producto) => acc + (producto.cantidad ?? 0),
        0
      );

      const venta = {
        id: idVenta,
        fecha,
        total: totalVenta,
        cantidad_total,
      };

      console.log("Guardando venta:", venta);
      await window.api.crearVenta(venta);

      for (const producto of productosTicket) {
        const detalleVenta = {
          id: crypto.randomUUID(),
          venta_id: idVenta, // 🟢 aseguramos que el campo se llame venta_id como en DB
          nombre: producto.nombre,
          codigo: producto.codigo ?? "",
          cantidad: producto.cantidad ?? 1,
          subtotal: (producto.cantidad ?? 1) * (producto.precio ?? 0),
        };

        console.log("Creando detalle:", detalleVenta);
        await window.api.crearDetalleVenta(detalleVenta);
      }

      setModalConfirmacionGuardar(false);
      setProductosTicket([]);
      navigate("/Ventas");

    } catch (error) {
      console.error("Error al guardar venta:", error);
      alert("Ocurrió un error al guardar la venta: " + (error instanceof Error ? error.message : String(error)));
    }
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
              onClick={() => setModalConfirmacionGuardar(true)}
            >
              <p>${total.toFixed(2)}</p>
              <img src="/img/icono_recibo.png" alt="Guardar venta" />
            </div>
          </div>
        </section>
      </main>

      <ModalAdvertencia
        titulo="¿Seguro que quieres guardar esta venta?"
        body="Se guardará la venta con los productos seleccionados."
        textBoton="Guardar"
        show={modalConfirmacionGuardar}
        onHide={() => setModalConfirmacionGuardar(false)}
        onConfirmar={guardarVenta}
      />

      <ModalError
        body="No hay productos en el ticket para guardar la venta."
        show={modalErrorNoProductos}
        onHide={() => setModalErrorNoProductos(false)}
      />
    </Fragment>
  );
}
