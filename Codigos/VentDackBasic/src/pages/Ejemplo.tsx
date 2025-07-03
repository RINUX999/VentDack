import React, { useEffect, useState } from 'react';
import type { Producto } from '../global';

export function Ejemplo() {
  const [productos, setProductos] = useState<Producto[]>([]);

  const cargarProductos = async () => {
    const datos = await window.api.obtenerProductos();
    setProductos(datos);
  };

  const agregarProducto = async () => {
    await window.api.insertarProducto('Café', 50);
    cargarProductos();
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  return (
    <div>
      <h1>Productos</h1>
      <button onClick={agregarProducto}>Agregar Café</button>
      <ul>
        {productos.map((p) => (
          <li key={p.id}>
            {p.nombre} - ${p.precio} - {new Date(p.creado_en).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
