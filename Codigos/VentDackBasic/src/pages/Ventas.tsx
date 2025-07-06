import { Fragment, useEffect, useState } from "react";
import Navegacion from "../components/Navegacion";
import Header from "../components/Header";
import "../styles/Ventas.css";
import TarjetaVenta  from "../components/TarjetaVenta";
import { useVentas } from "../hooks/useVenta";
import type { Venta } from "../types/models_types";

const mesesTextoAMes = {
  "Enero": 0, "Febrero": 1, "Marzo": 2, "Abril": 3, "Mayo": 4, "Junio": 5,
  "Julio": 6, "Agosto": 7, "Septiembre": 8, "Octubre": 9, "Noviembre": 10, "Diciembre": 11,
};

export default function Ventas() {
  const { ventas } = useVentas();
  const [ventasMostrar, setVentasMostrar] = useState<Venta[]>([]);
  const [selectAño, setSelectAño] = useState("");
  const [selectMes, setSelectMes] = useState("");
  const [selectDia, setSelectDia] = useState("");

  useEffect(() => {
    if (ventas) {
      const filtradas = ventas.filter((venta) => {
        const fecha = new Date(venta.fecha);
        const añoOK = selectAño === "" || fecha.getFullYear().toString() === selectAño;
        const mesOK = selectMes === "" || fecha.getMonth() === mesesTextoAMes[selectMes as keyof typeof mesesTextoAMes];
        const diaOK = selectDia === "" || fecha.getDate().toString() === selectDia;
        return añoOK && mesOK && diaOK;
      });
      setVentasMostrar(filtradas);
    }
  }, [ventas, selectAño, selectMes, selectDia]);

  const limpiarFiltros = () => {
    setSelectAño("");
    setSelectMes("");
    setSelectDia("");
  };

  const totalAcumulado = ventasMostrar.reduce((acc, venta) => acc + venta.total, 0);

  return (
    <Fragment>
      <main>
        <aside>
          <Navegacion pagina={"Ventas"} />
        </aside>
        <section>
          <Header pagina="Ventas" />

          <div className="ver-ventas">
            <div className="buscador">
              <p>Fecha</p>
              <div className="eleccion">
                <p>Año</p>
                <select value={selectAño} onChange={(e) => setSelectAño(e.target.value)}>
                  <option value=""></option>
                  {[2025, 2026, 2027, 2028, 2029, 2030].map((año) => (
                    <option key={año} value={año}>{año}</option>
                  ))}
                </select>
              </div>
              <div className="eleccion">
                <p>Mes</p>
                <select value={selectMes} onChange={(e) => setSelectMes(e.target.value)}>
                  <option value=""></option>
                  {Object.keys(mesesTextoAMes).map((mes) => (
                    <option key={mes} value={mes}>{mes}</option>
                  ))}
                </select>
              </div>
              <div className="eleccion">
                <p>Día</p>
                <select value={selectDia} onChange={(e) => setSelectDia(e.target.value)}>
                  <option value=""></option>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((dia) => (
                    <option key={dia} value={dia}>{dia}</option>
                  ))}
                </select>
              </div>
              <img src="/img/icono_clear.png" alt="Limpiar filtros" onClick={limpiarFiltros} style={{ cursor: "pointer" }} />
            </div>

            <div className="contenedor-ventas">
              {ventasMostrar.map((venta) => (
                <TarjetaVenta key={venta.id} venta={venta} />
              ))}
            </div>

            <div className="cantidad-ventas">
              <p>Número de ventas: {ventasMostrar.length}</p>
              <p>Total Acumulado: ${totalAcumulado.toFixed(2)}</p>
            </div>
          </div>
        </section>
      </main>
    </Fragment>
  );
}
