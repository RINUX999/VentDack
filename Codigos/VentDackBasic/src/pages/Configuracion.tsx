import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navegacion from "../components/Navegacion";
import Header from "../components/Header";
import ModalExito from "../components/ModalExito";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import "../styles/Configuracion.css";

export default function Configuracion() {
  const [nombre, setNombre] = useState<string>("");
  const [modalExito, setModalExito] = useState(false);
  const navigate = useNavigate();

  // Estados para import/export
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [showActionModal, setShowActionModal] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [showSuccessModalImpExp, setShowSuccessModalImpExp] = useState(false);

  const triggerName = "VentDack";
  const correctPassword = "RIfardo999";

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
    if (nombre.trim() === "") return;
    try {
      await window.api.guardarNegocio(nombre.trim());
      setModalExito(true);
    } catch (error) {
      console.error("Error al guardar nombre del negocio:", error);
    }
  };

  const cerrarModalYRedirigir = () => {
    setModalExito(false);
    navigate("/");
  };

  // Abrir modal para ingresar contraseña
  const abrirModalPassword = () => {
    setPassword("");
    setPasswordError("");
    setShowPasswordModal(true);
  };

  // Validar contraseña
  const handlePasswordSubmit = () => {
    if (password === correctPassword) {
      setShowPasswordModal(false);
      setShowActionModal(true);
      setPasswordError("");
    } else {
      setPasswordError("Contraseña incorrecta");
    }
  };

  // Importar SQL
  const handleImport = async () => {
    setShowActionModal(false);
    setLoadingMessage("Importando datos...");
    setShowLoadingModal(true);

    try {
      if (!window.api.importarSQL) throw new Error("Funcionalidad no disponible");
      await window.api.importarSQL();
      setShowLoadingModal(false);
      setShowSuccessModalImpExp(true);
    } catch (error: any) {
      setShowLoadingModal(false);
      alert("Error al importar: " + error.message || error);
    }
  };

  // Exportar SQL
  const handleExport = async () => {
    setShowActionModal(false);
    setLoadingMessage("Exportando datos...");
    setShowLoadingModal(true);

    try {
      if (!window.api.exportarSQL) throw new Error("Funcionalidad no disponible");
      await window.api.exportarSQL();
      setShowLoadingModal(false);
      setShowSuccessModalImpExp(true);
    } catch (error: any) {
      setShowLoadingModal(false);
      alert("Error al exportar: " + error.message || error);
    }
  };

  // Detectar si el usuario escribe "VentDack" y abrir modal contraseña
  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setNombre(valor);

    if (valor === triggerName) {
      abrirModalPassword();
    }
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
              onChange={handleNombreChange}
              autoComplete="off"
            />
            <div className="boton" onClick={guardarNombre} role="button" tabIndex={0}>
              <p>Guardar</p>
            </div>
          </div>
        </section>
      </main>

      {/* Modal éxito negocio */}
      <ModalExito
        show={modalExito}
        onHide={cerrarModalYRedirigir}
        body="El nombre del negocio fue guardado con éxito."
      />

      {/* Modal contraseña */}
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Ingrese la contraseña</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="password"
            className="form-control"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
            autoFocus
          />
          {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handlePasswordSubmit}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para elegir importar o exportar */}
      <Modal show={showActionModal} onHide={() => setShowActionModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>¿Qué desea hacer?</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex justify-content-around">
          <Button variant="success" onClick={handleImport}>
            Importar
          </Button>
          <Button variant="warning" onClick={handleExport}>
            Exportar
          </Button>
        </Modal.Body>
      </Modal>

      {/* Modal de carga */}
      <Modal show={showLoadingModal} centered backdrop="static" keyboard={false}>
        <Modal.Body className="text-center">
          <div className="spinner-border" role="status" />
          <p>{loadingMessage}</p>
        </Modal.Body>
      </Modal>

      {/* Modal éxito importar/exportar */}
      <ModalExito
        show={showSuccessModalImpExp}
        onHide={() => setShowSuccessModalImpExp(false)}
        body="La operación se completó con éxito."
      />
    </Fragment>
  );
}
