import { Fragment, useEffect, useRef, useState } from "react";
import { Buffer } from "buffer";
import Header from "../components/Header";
import Navegacion from "../components/Navegacion";
import "../styles/Producto.css";
import { useLocation, useNavigate } from "react-router-dom";
import type { ProductoNuevo } from "../types/models_types";
import ModalError from "../components/ModalError";
import ModalExito from "../components/ModalExito";
import ModalProductoActualizar from "../components/ModalProductoActualizar";
import ModalAdvertencia from "../components/ModalAdvertencia";

export default function Producto() {
  const location = useLocation();
  const navigate = useNavigate();

  const productoBase = location.state?.producto as ProductoNuevo | undefined;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [nombre, setNombre] = useState("");
  const [codigo, setCodigo] = useState("");
  const [cantidad, setCantidad] = useState<number | "">("");
  const [precio, setPrecio] = useState<number | "">("");
  const [descripcion, setDescripcion] = useState("");
  const [rutaImagenLocal, setRutaImagenLocal] = useState<string | null>(null);
  const [imagenTemporal, setImagenTemporal] = useState<string | null>(null);

  const [modalErrorNombre, setModalErrorNombre] = useState(false);
  const [modalErrorCantidad, setModalErrorCantidad] = useState(false);
  const [modalErrorPrecio, setModalErrorPrecio] = useState(false);
  const [modalActualizar, setModalActualizar] = useState(false);
  const [modalExito, setModalExito] = useState(false);
  const [modalAdvertenciaReset, setModalAdvertenciaReset] = useState(false);
  const [modalAdvertenciaEliminar, setModalAdvertenciaEliminar] = useState(false);

  useEffect(() => {
    if (!productoBase) {
      navigate("/");
      return;
    }
    setNombre(productoBase.nombre);
    setCodigo(productoBase.codigo || "");
    setCantidad(productoBase.cantidad ?? "");
    setPrecio(productoBase.precio ?? "");
    setDescripcion(productoBase.descripcion || "");
    setRutaImagenLocal(productoBase.url_img || null);
  }, [productoBase, navigate]);

  const guardarImagenElectron = async (buffer: Buffer, nombreArchivo: string): Promise<string | null> => {
    try {
      const rutaGuardada = await window.api.guardarImagenBuffer(buffer, nombreArchivo);
      return rutaGuardada;
    } catch (error) {
      console.error("Error guardando imagen:", error);
      return null;
    }
  };

  const eliminarImagenElectron = async (ruta: string): Promise<boolean> => {
    try {
      const eliminado = await window.api.eliminarImagen(ruta);
      return eliminado;
    } catch (error) {
      console.error("Error eliminando imagen:", error);
      return false;
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const blobURL = URL.createObjectURL(file);
      setImagenTemporal(blobURL);

      if (rutaImagenLocal) {
        await eliminarImagenElectron(rutaImagenLocal);
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const rutaGuardada = await guardarImagenElectron(buffer, file.name);

      if (rutaGuardada) {
        setRutaImagenLocal(rutaGuardada);
        console.log("Imagen guardada y ruta actualizada:", rutaGuardada);
      } else {
        console.warn("No se pudo guardar la imagen.");
        setRutaImagenLocal(null);
      }
    }
  };

  const abrirInput = () => {
    if (imagenTemporal || rutaImagenLocal) {
      // Si hay imagen temporal o guardada, botón quita la imagen
      setImagenTemporal(null);
      setRutaImagenLocal(null);
      if (inputRef.current) inputRef.current.value = "";
    } else {
      inputRef.current?.click();
    }
  };

  const getImagenUrlElectron = () => {
    if (imagenTemporal) return imagenTemporal;
    if (rutaImagenLocal) {
      const nombreArchivo = rutaImagenLocal.split(/[\\/]/).pop();
      return nombreArchivo ? `app-img://${nombreArchivo}` : null;
    }
    return null;
  };

  const imagenUrlParaMostrar = getImagenUrlElectron();

  const validaciones = (): boolean => {
    if (nombre === "") {
      setModalErrorNombre(true);
      return false;
    } else if (cantidad === "" || cantidad <= 0) {
      setModalErrorCantidad(true);
      return false;
    } else if (precio === "" || precio <= 0) {
      setModalErrorPrecio(true);
      return false;
    } else {
      return true;
    }
  };

  const guardarProducto = () => {
    if (validaciones()) {
      setModalActualizar(true);
    }
  };

const confirmarActualizacion = async () => {
  if (!productoBase) return;

  try {
    // Si el producto original tenía imagen y ahora ya no hay imagen, elimínala
    if (productoBase.url_img && !rutaImagenLocal) {
      await eliminarImagenElectron(productoBase.url_img);
    }

    const productoActualizado: ProductoNuevo = {
      ...productoBase,
      nombre,
      codigo,
      cantidad: typeof cantidad === "number" ? cantidad : 0,
      precio: typeof precio === "number" ? precio : 0,
      descripcion,
      url_img: rutaImagenLocal || "",
    };

    // Aquí va la llamada real para guardar el producto actualizado en la base de datos
    await window.api.editarProducto(productoActualizado);

    setModalActualizar(false);
    setModalExito(true);
  } catch (error) {
    console.error("Error actualizando producto:", error);
    setModalActualizar(false);
    // Puedes mostrar un modal de error si lo deseas
  }
};


  const resetearFormulario = () => {
    if (!productoBase) return;
    setNombre(productoBase.nombre);
    setCodigo(productoBase.codigo || "");
    setCantidad(productoBase.cantidad ?? "");
    setPrecio(productoBase.precio ?? "");
    setDescripcion(productoBase.descripcion || "");
    setRutaImagenLocal(productoBase.url_img || null);
    setImagenTemporal(null);
    setModalAdvertenciaReset(false);
  };

  const eliminarProducto = async () => {
    try {
      if (!productoBase) {
        console.error("No hay producto para eliminar");
        return;
      }

      // Elimina la imagen local si existe
      if (rutaImagenLocal) {
        await eliminarImagenElectron(rutaImagenLocal);
      }

      // Llama a tu API o función para eliminar el producto, ejemplo:
      await window.api.eliminarProducto(productoBase.id);

      setModalAdvertenciaEliminar(false);
      setModalExito(true);
    } catch (error) {
      console.error("Error eliminando producto:", error);
      // Opcional: mostrar modal error
      setModalAdvertenciaEliminar(false);
    }
  };

  const cerrarModalExito = () => {
    setModalExito(false);
    navigate("/Productos");
  };

  return (
    <Fragment>
      <main>
        <aside>
          <Navegacion pagina={"Producto"} />
        </aside>
        <section>
          <Header pagina="Producto" />
          <div className="ver-producto">
            <div className="opciones">
              <img src="/img/icono_eliminar.png" onClick={() => setModalAdvertenciaEliminar(true)} alt="Eliminar" />
              <img src="/img/icono_reset.png" onClick={() => setModalAdvertenciaReset(true)} alt="Reset" />
              <img src="/img/icono_guardar.png" alt="Guardar" onClick={() => guardarProducto()} />
            </div>
            <form>
              <label htmlFor="nombre">Nombre:</label>
              <input type="text" id="nombre" name="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
              <label htmlFor="codigo">Código:</label>
              <input type="text" id="codigo" name="codigo" value={codigo} onChange={(e) => setCodigo(e.target.value)} />
              <label htmlFor="cantidad">Cantidad:</label>
              <input type="number" id="cantidad" name="cantidad" value={cantidad} onChange={(e) => setCantidad(e.target.value === "" ? "" : Number(e.target.value))} />
              <label htmlFor="precio">Precio:</label>
              <div className="contenedor-precio">
                <span className="simbolo-precio">$</span>
                <input type="number" id="precio" name="precio" step="1" min="0" placeholder="0.00" value={precio} onChange={(e) => setPrecio(e.target.value === "" ? "" : Number(e.target.value))} />
              </div>
              <div className="ultimas-opciones">
                <div className="descripcion">
                  <label htmlFor="descripcion">Descripción:</label>
                  <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Escribe una descripción..." className="descripcion" />
                </div>
                <div className="subir-imagen">
                  <div className="boton-imagen">
                    <label>Imagen:</label>
                    <button onClick={abrirInput} type="button">
                      {(imagenTemporal || rutaImagenLocal) ? "Quitar imagen" : "Subir imagen"}
                    </button>
                    <input type="file" accept="image/*" onChange={handleFileChange} ref={inputRef} style={{ display: "none" }} />
                  </div>
                  {imagenUrlParaMostrar && (
                    <img
                      key={imagenUrlParaMostrar}
                      src={imagenUrlParaMostrar}
                      alt="Imagen seleccionada"
                      style={{ maxWidth: "200px", marginTop: "10px" }}
                      onError={(e) => {
                        console.error("Error cargando imagen", e.currentTarget.src);
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                </div>
              </div>
            </form>
          </div>
        </section>
      </main>

      <ModalError body="No ingresaste nombre" show={modalErrorNombre} onHide={() => setModalErrorNombre(false)} />
      <ModalError body="La cantidad debe ser mayor que cero." show={modalErrorCantidad} onHide={() => setModalErrorCantidad(false)} />
      <ModalError body="El precio debe ser mayor que cero." show={modalErrorPrecio} onHide={() => setModalErrorPrecio(false)} />

      <ModalProductoActualizar
        titulo="¿Deseas guardar los cambios?"
        body="Se actualizará el producto con la nueva información."
        textBoton="Actualizar"
        show={modalActualizar}
        onHide={() => setModalActualizar(false)}
        producto={{
          ...productoBase!,
          nombre,
          codigo,
          cantidad: typeof cantidad === "number" ? cantidad : 0,
          precio: typeof precio === "number" ? precio : 0,
          descripcion,
          url_img: rutaImagenLocal || "",
        }}
        onConfirmar={confirmarActualizacion}
      />

      <ModalExito
        titulo="Éxito"
        body="Operación realizada correctamente."
        show={modalExito}
        onHide={cerrarModalExito}
      />

      <ModalAdvertencia
        titulo="¿Deseas restablecer los cambios?"
        body="Los datos serán revertidos a los valores originales."
        textBoton="Restablecer"
        show={modalAdvertenciaReset}
        onHide={() => setModalAdvertenciaReset(false)}
        onConfirmar={resetearFormulario}
      />

      <ModalAdvertencia
        titulo="¿Deseas eliminar este producto?"
        body="El producto será eliminado permanentemente."
        textBoton="Eliminar"
        show={modalAdvertenciaEliminar}
        onHide={() => setModalAdvertenciaEliminar(false)}
        onConfirmar={eliminarProducto}
      />
    </Fragment>
  );
}
