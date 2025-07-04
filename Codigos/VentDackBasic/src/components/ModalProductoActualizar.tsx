// src/components/ModalProductoActualizar.tsx
import { Modal, Button } from 'react-bootstrap';
import type { ModalProps } from 'react-bootstrap';
import { PencilSquare } from 'react-bootstrap-icons';
import { useState } from 'react';
import ModalExito from './ModalExito';
import ModalError from './ModalError';
import type { ProductoNuevo } from '../types/models_types';

type ModalActualizarProps = ModalProps & {
  titulo: string;
  body: string;
  textBoton: string;
  producto: ProductoNuevo;
  onHide: () => void;
};

export default function ModalProductoActualizar({
  titulo,
  body,
  textBoton,
  producto,
  onHide,
  ...modalProps
}: ModalActualizarProps) {
  const [mostrandoExito, setMostrandoExito] = useState(false);
  const [mostrandoError, setMostrandoError] = useState(false);

  const actualizarProducto = async () => {
    try {
      await window.api.editarProducto(producto);
      setMostrandoExito(true);
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      setMostrandoError(true);
    }
  };

  const cerrarTodo = () => {
    setMostrandoExito(false);
    onHide();
  };

  return (
    <>
      <Modal
        {...modalProps}
        onHide={onHide}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title className="d-flex align-items-center gap-2">
            <PencilSquare />
            {titulo}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light">
          <p className="text-dark fw-bold">{body}</p>
        </Modal.Body>
        <Modal.Footer className="bg-light">
          <Button variant="secondary" onClick={onHide}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={actualizarProducto}>
            {textBoton}
          </Button>
        </Modal.Footer>
      </Modal>

      <ModalExito
        body="Producto actualizado correctamente."
        show={mostrandoExito}
        onHide={cerrarTodo}
      />

      <ModalError
        body="Hubo un error al actualizar el producto. Intenta de nuevo."
        show={mostrandoError}
        onHide={() => setMostrandoError(false)}
      />
    </>
  );
}
