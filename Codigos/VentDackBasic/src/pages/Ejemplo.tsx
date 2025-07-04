import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import "../styles/Ejemplo.css"
import type { ProductoNuevo } from '../types/models_types';
import 'bootstrap/dist/css/bootstrap.min.css';


export function Ejemplo() {
  const [productos, setProductos] = useState<ProductoNuevo[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editandoProducto, setEditandoProducto] = useState<ProductoNuevo | null>(null);
  const [formProducto, setFormProducto] = useState<Partial<ProductoNuevo>>({
    nombre: '',
    codigo: '',
    cantidad: 0,
    precio: 0,
    descripcion: '',
    url_img: ''
  });

  const cargarProductos = async () => {
    const datos = await window.api.obtenerProductos();
    setProductos(datos);
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const abrirModalNuevo = () => {
    setFormProducto({ nombre: '', codigo: '', cantidad: 0, precio: 0, descripcion: '', url_img: '' });
    setEditandoProducto(null);
    setShowModal(true);
  };

  const abrirModalEditar = (producto: ProductoNuevo) => {
    setFormProducto(producto);
    setEditandoProducto(producto);
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setEditandoProducto(null);
  };

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormProducto(prev => ({
      ...prev,
      [name]: name === 'precio' || name === 'cantidad' ? Number(value) : value
    }));
  };

  const guardarProducto = async () => {
    if (!formProducto.nombre || !formProducto.precio) {
      alert('Nombre y precio son obligatorios');
      return;
    }

    if (editandoProducto) {
      await window.api.editarProducto({ ...(formProducto as ProductoNuevo), id: editandoProducto.id });
    } else {
      // Generar un id simple, o mejor genera en backend
      const nuevoId = Date.now().toString();
      await window.api.crearProducto({ ...(formProducto as ProductoNuevo), id: nuevoId });
    }

    cerrarModal();
    cargarProductos();
  };

  const eliminarProducto = async (id: string) => {
    if (window.confirm('¿Eliminar este producto?')) {
      await window.api.eliminarProducto(id);
      cargarProductos();
    }
  };

  return (
    <div className="container mt-4">
      <h1>Gestor de Productos</h1>
      <Button variant="primary" onClick={abrirModalNuevo} className="mb-3">Agregar Producto</Button>

      <ul className="list-group">
        {productos.map(p => (
          <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{p.nombre}</strong> (${p.precio})
              <div><small>{p.descripcion}</small></div>
            </div>
            <div>
              <Button variant="warning" size="sm" onClick={() => abrirModalEditar(p)}>Editar</Button>{' '}
              <Button variant="danger" size="sm" onClick={() => eliminarProducto(p.id)}>Eliminar</Button>
            </div>
          </li>
        ))}
      </ul>

      <Modal show={showModal} onHide={cerrarModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editandoProducto ? 'Editar Producto' : 'Nuevo Producto'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="nombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={formProducto.nombre || ''}
                onChange={manejarCambio}
                placeholder="Nombre del producto"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="codigo">
              <Form.Label>Código</Form.Label>
              <Form.Control
                type="text"
                name="codigo"
                value={formProducto.codigo || ''}
                onChange={manejarCambio}
                placeholder="Código"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="cantidad">
              <Form.Label>Cantidad</Form.Label>
              <Form.Control
                type="number"
                name="cantidad"
                value={formProducto.cantidad ?? 0}
                onChange={manejarCambio}
                placeholder="Cantidad"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="precio">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                name="precio"
                value={formProducto.precio ?? 0}
                onChange={manejarCambio}
                placeholder="Precio"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="descripcion">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                name="descripcion"
                value={formProducto.descripcion || ''}
                onChange={manejarCambio}
                placeholder="Descripción"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="url_img">
              <Form.Label>URL Imagen</Form.Label>
              <Form.Control
                type="text"
                name="url_img"
                value={formProducto.url_img || ''}
                onChange={manejarCambio}
                placeholder="URL de la imagen"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModal}>Cancelar</Button>
          <Button variant="primary" onClick={guardarProducto}>{editandoProducto ? 'Guardar' : 'Crear'}</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
