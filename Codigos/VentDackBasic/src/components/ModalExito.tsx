import { Modal, Button } from 'react-bootstrap';
import type { ModalProps } from 'react-bootstrap';

type ModalExitoProps = ModalProps & {
  body: string;
  onExited?: () => void;  // <-- agregamos esta prop opcional
};

export default function ModalExito(props: ModalExitoProps) {
  const { body, onExited, ...modalProps } = props;
  return (
    <Modal
      {...modalProps}
      size="lg"
      aria-labelledby="modal-success-title"
      centered
      onExited={onExited}  // <-- la usamos aquí para el evento cuando termina la animación de cierre
    >
      <Modal.Header closeButton className="bg-success text-white">
        <Modal.Title id="modal-success-title">
          ✅ Éxito
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-success fw-bold">
          {body}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={props.onHide}>Aceptar</Button>
      </Modal.Footer>
    </Modal>
  );
}
