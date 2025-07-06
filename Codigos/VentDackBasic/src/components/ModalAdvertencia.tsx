import { Modal, Button, Spinner } from 'react-bootstrap';
import type { ModalProps } from 'react-bootstrap';
import { ExclamationTriangleFill } from 'react-bootstrap-icons';

type ModalGenericoProps = ModalProps & {
  titulo: string;
  body: string;
  textBoton: string;
  onConfirmar?: () => void;
  loading?: boolean; // nueva prop para estado de carga
};

export default function ModalAdvertencia(props: ModalGenericoProps) {
  const { titulo, body, textBoton, onConfirmar, loading = false, ...modalProps } = props;

  return (
    <Modal
      {...modalProps}
      aria-labelledby="modal-generico"
      centered
      keyboard={!loading}
    >
      <Modal.Header closeButton={!loading} className="bg-warning text-dark">
        <Modal.Title id="modal-generico" className="d-flex align-items-center gap-2">
          <ExclamationTriangleFill className="text-danger" />
          {titulo}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-light">
        <p className="text-danger fw-bold">{body}</p>
      </Modal.Body>
      <Modal.Footer className="bg-light">
        <Button variant="secondary" onClick={props.onHide} disabled={loading}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirmar} disabled={loading}>
          {loading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Procesando...
            </>
          ) : (
            textBoton
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
