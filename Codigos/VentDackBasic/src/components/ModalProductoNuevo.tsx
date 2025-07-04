import { Modal, Button, Spinner } from 'react-bootstrap';
import type { ModalProps } from 'react-bootstrap';
import type { ProductoNuevo } from "../types/models_types";
import { useState } from 'react';
import { useProduct } from '../hooks/useProduct';
import { useNavigate } from 'react-router-dom';
import ModalExito from './ModalExito';
import ModalError from './ModalError';

type ModalProductoProps = ModalProps & {
  titulo: string;
  body: string;
  textBoton: string;
  producto: ProductoNuevo | "";
  imagenURL: string | null;
  procesarYGuardarImagen: () => Promise<string | null>;
};

export default function ModalProductoNuevo(props: ModalProductoProps) {
  const { titulo, body, textBoton, producto, procesarYGuardarImagen, imagenURL, ...modalProps } = props;
  const { crearProducto } = useProduct();
  const navigate = useNavigate();

  const [cargando, setCargando] = useState(false);
  const [exitoModal, setExitoModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const guardarProducto = async () => {
    setCargando(true);
    try {
      let rutaImg = null;

      if (imagenURL && imagenURL.trim() !== "") {
        rutaImg = await procesarYGuardarImagen();
      }

      if (producto !== "") {
        await crearProducto({ ...producto, url_img: rutaImg ?? producto.url_img });
      }

      setCargando(false);
      setExitoModal(true);
    } catch (error: any) {
      console.error("Error guardando producto:", error);
      setErrorMsg(error?.message || "Error inesperado al guardar el producto.");
      setErrorModal(true);
      setCargando(false);
    }
  };

  const handleExitoCerrar = () => {
    setExitoModal(false);
    props.onHide?.();
    navigate("/Productos");
  };

  return (
    <>
      <Modal
        {...modalProps}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop={cargando ? "static" : true}
        keyboard={!cargando}
      >
        <Modal.Header closeButton={!cargando}>
          <Modal.Title id="contained-modal-title-vcenter">{titulo}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{body}</p>
          {cargando && (
            <div className="d-flex align-items-center">
              <Spinner animation="border" role="status" className="me-2" />
              <span>Guardando, por favor espere...</span>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide} disabled={cargando}>
            Cancelar
          </Button>
          <Button onClick={guardarProducto} disabled={cargando}>
            {textBoton}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de éxito */}
      <ModalExito
        show={exitoModal}
        onHide={handleExitoCerrar}
        body="Producto guardado con éxito."
      />

      {/* Modal de error */}
      <ModalError
        show={errorModal}
        onHide={() => setErrorModal(false)}
        body={errorMsg}
      />
    </>
  );
}
