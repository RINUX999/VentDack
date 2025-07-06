import { useEffect, useState } from "react";
import type { ProductoNuevo } from "../types/models_types";

export const useProduct = () => {
  const [productos, setProductos] = useState<ProductoNuevo[]>([]);
  const [productosBuscados, setProductosBuscados] = useState<ProductoNuevo[]>([]);
  const [producto, setProducto] = useState<ProductoNuevo | undefined>();

  const [formProducto, setFormProducto] = useState<Partial<ProductoNuevo>>({
    nombre: '',
    codigo: '',
    cantidad: 0,
    precio: 0,
    descripcion: '',
    url_img: ''
  });

  const cargarProductos = async () => {
    if (!window.api?.obtenerProductos) {
      console.error("API no disponible: window.api.obtenerProductos no existe");
      return;
    }
    try {
      const datos = await window.api.obtenerProductos();
      setProductos(datos);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const obtenerProducto = (nombre: string, codigo: string) => {
    const Producto = productos.find(
      producto => producto.nombre === nombre || producto.codigo === codigo
    );
    if (Producto) {
      setProducto(Producto);
    } else {
      setProducto(undefined);
    }
  };

  const obtenerProductos = (nombre: string, codigo: string) => {
    let ProductosBuscados: ProductoNuevo[] = [];
    if (codigo === "") {
      ProductosBuscados = productos.filter(producto => producto.nombre === nombre);
    } else {
      ProductosBuscados = productos.filter(
        producto => producto.nombre === nombre || producto.codigo === codigo
      );
    }
    setProductosBuscados(ProductosBuscados);
  };

  const actualizarProducto = async () => {
    // implementar según necesidad
  };

  const crearProducto = async (producto: ProductoNuevo) => {
    if (!window.api?.crearProducto) {
      console.error("API no disponible: window.api.crearProducto no existe");
      return;
    }
    try {
      await window.api.crearProducto(producto);
      await cargarProductos(); // recarga los productos después de crear
    } catch (error) {
      console.error("Error al crear producto:", error);
    }
  };

  const eliminarProducto = async (id: string) => {
    if (!window.api?.eliminarProducto) {
      console.error("API no disponible: window.api.eliminarProducto no existe");
      return;
    }
    try {
      await window.api.eliminarProducto(id);
      await cargarProductos(); // recarga los productos después de eliminar
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };

  return {
    productos,
    productosBuscados,
    producto,
    obtenerProducto,
    obtenerProductos,
    actualizarProducto,
    crearProducto,
    eliminarProducto,
    setFormProducto,
    formProducto,
  };
};
