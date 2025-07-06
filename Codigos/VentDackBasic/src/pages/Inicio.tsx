import { Fragment, useEffect, useState } from "react";
import "../styles/Inicio.css";
import Navegacion from "../components/Navegacion";
import Header from "../components/Header";
import type { ProductoNuevo, Venta } from "../types/models_types";

export default function Inicio() {
  const [productos, setProductos] = useState<ProductoNuevo[]>([]);
  const [ventas, setVentas] = useState<Venta[]>([]);

  useEffect(() => {
    // Función para cargar productos y ventas
    async function cargarDatos() {
      try {
        const productosObtenidos = await window.api.obtenerProductos();
        setProductos(productosObtenidos);

        const ventasObtenidas = await window.api.obtenerVentas();
        setVentas(ventasObtenidas);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    }
    cargarDatos();
  }, []);

  // Calcular productos sin elementos (cantidad 0 o indefinida)
  const productosSinElementos = productos.filter(p => !p.cantidad || p.cantidad === 0).length;

  // Calcular productos con elementos (cantidad > 0)
  const productosConElementos = productos.filter(p => p.cantidad && p.cantidad > 0).length;

  return (
    <Fragment>
      <main>
        <aside>
          <Navegacion pagina={"Inicio"} />
        </aside>
        <section>
          <Header pagina="Inicio" />
          <div className="inicio-tarjetas">
            <div className="inicio-tarjeta t1">
              <p className="inicio-titulo-tarjeta">
                Cantidad de Productos Registrados:
              </p>
              <p className="inicio-dato-tarjeta">{productos.length}</p>
            </div>
            <div className="inicio-tarjeta t2">
              <p className="inicio-titulo-tarjeta">
                Cantidad de Ventas:
              </p>
              <p className="inicio-dato-tarjeta">{ventas.length}</p>
            </div>
            <div className="inicio-tarjeta t3">
              <p className="inicio-titulo-tarjeta">
                Productos sin elementos:
              </p>
              <p className="inicio-dato-tarjeta">{productosSinElementos}</p>
            </div>
            <div className="inicio-tarjeta t4">
              <p className="inicio-titulo-tarjeta">
                Productos con elementos:
              </p>
              <p className="inicio-dato-tarjeta">{productosConElementos}</p>
            </div>
          </div>
        </section>
      </main>
    </Fragment>
  );
}
