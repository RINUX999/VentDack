import { Modal, Button } from 'react-bootstrap';
import type { ModalProps } from 'react-bootstrap';
import { ExclamationTriangleFill } from 'react-bootstrap-icons';

type ModalGenericoProps = ModalProps & {
  titulo: string;
  body: string;
  textBoton: string;
  onConfirmar?: () => void;
};

export default function ModalAdvertencia(props: ModalGenericoProps) {
  const { titulo, body, textBoton, onConfirmar, ...modalProps } = props;

  return (
    <Modal
      {...modalProps}
      aria-labelledby="modal-generico"
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton className="bg-warning text-dark">
        <Modal.Title id="modal-generico" className="d-flex align-items-center gap-2">
          <ExclamationTriangleFill className="text-danger" />
          {titulo}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-light">
        <p className="text-danger fw-bold">{body}</p>
      </Modal.Body>
      <Modal.Footer className="bg-light">
        <Button variant="secondary" onClick={props.onHide}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirmar}>
          {textBoton}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
