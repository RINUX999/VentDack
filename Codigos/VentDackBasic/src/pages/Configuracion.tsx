import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navegacion from "../components/Navegacion";
import Header from "../components/Header";
import ModalExito from "../components/ModalExito";

import "../styles/Configuracion.css";

export default function Configuracion() {
  const [nombre, setNombre] = useState("");
  const [modalExito, setModalExito] = useState(false);
  const navigate = useNavigate(); // 👈 necesario para redirigir

  useEffect(() => {
    const cargarNegocio = async () => {
      try {
        const negocio = await window.api.obtenerNegocio();
        if (negocio?.nombre) {
          setNombre(negocio.nombre);
        }
      } catch (error) {
        console.error("Error al cargar negocio:", error);
      }
    };

    cargarNegocio();
  }, []);

  const guardarNombre = async () => {
    try {
      if (nombre.trim() === "") return;
      await window.api.guardarNegocio(nombre.trim());
      setModalExito(true);
    } catch (error) {
      console.error("Error al guardar nombre del negocio:", error);
    }
  };

  const cerrarModalYRedirigir = () => {
    setModalExito(false);
    navigate("/"); // 👈 redirige al inicio
  };

  return (
    <Fragment>
      <main>
        <aside>
          <Navegacion pagina="Configuracion" />
        </aside>
        <section>
          <Header pagina="Configuracion" />
          <div className="configuracion">
            <p>Nombre del Negocio:</p>
            <input
              type="text"
              placeholder="Nombre del negocio"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <div className="boton" onClick={guardarNombre}>
              <p>Guardar</p>
            </div>
          </div>
        </section>
      </main>

      <ModalExito
        show={modalExito}
        onHide={cerrarModalYRedirigir} // 👈 redirección aquí
        body="El nombre del negocio fue guardado con éxito."
      />
    </Fragment>
  );
}
