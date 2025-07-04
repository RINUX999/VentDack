import { Modal, Button } from 'react-bootstrap';
import type { ModalProps } from 'react-bootstrap';

type ModalExitoProps = ModalProps & {
  body: string;
};

export default function ModalExito(props: ModalExitoProps) {
  const { body, ...modalProps } = props;
  return (
    <Modal
      {...modalProps}
      size="lg"
      aria-labelledby="modal-success-title"
      centered
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
