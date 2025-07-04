import { Modal, Button } from 'react-bootstrap';
import type { ModalProps } from 'react-bootstrap';

type ModalProductoProps = ModalProps & {
  body: string;
};

export default function ModalError(props: ModalProductoProps) {
  const { body, ...modalProps } = props;

  return (
    <Modal
      {...modalProps}
      size="lg"
      aria-labelledby="modal-error-title"
      centered
    >
      <Modal.Header closeButton className="bg-danger text-white">
        <Modal.Title id="modal-error-title">
          ⚠️ Error
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-danger fw-bold">
          {body}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={props.onHide}>OK</Button>
      </Modal.Footer>
    </Modal>
  );
}
