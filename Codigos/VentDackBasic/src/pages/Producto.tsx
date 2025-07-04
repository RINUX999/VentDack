import { Fragment, useEffect, useRef, useState } from "react";
import { Buffer } from "buffer";
import Header from "../components/Header";
import Navegacion from "../components/Navegacion";
import "../styles/Producto.css";
import { useLocation, useNavigate } from "react-router-dom";
import type { ProductoNuevo } from "../types/models_types";

export default function Producto() {
  const location = useLocation();
  const navigate = useNavigate();

  const producto = location.state?.producto as ProductoNuevo | undefined;

  const inputRef = useRef<HTMLInputElement | null>(null);

  // Estado para la imagen local guardada con ruta absoluta y file://
  const [rutaImagenLocal, setRutaImagenLocal] = useState<string | null>(null);

  // Estado para imagen temporal (blob) cuando el usuario carga nueva imagen
  const [imagenTemporal, setImagenTemporal] = useState<string | null>(null);

  useEffect(() => {
    if (!producto) {
      navigate("/");
      return;
    }
    if (producto.url_img) {
      // La ruta debe tener el prefijo file://
      // Solo agrega file:// si no lo tiene ya (seguridad)
      const ruta = producto.url_img.startsWith("file://")
        ? producto.url_img
        : `file://${producto.url_img}`;
      setRutaImagenLocal(ruta);
      console.log("Ruta de imagen local seteada:", ruta);
    }
  }, [producto, navigate]);

  if (!producto) {
    return <p style={{ padding: "2rem" }}>Producto no encontrado. Redirigiendo...</p>;
  }

  const guardarImagenElectron = async (
    buffer: Buffer,
    nombreArchivo: string
  ): Promise<string | null> => {
    try {
      const rutaGuardada = await window.api.guardarImagenBuffer(buffer, nombreArchivo);
      return rutaGuardada;
    } catch (error) {
      console.error("Error guardando imagen:", error);
      return null;
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      // Crear URL blob para vista previa
      const blobURL = URL.createObjectURL(file);
      setImagenTemporal(blobURL);

      // Guardar la imagen en disco
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const rutaGuardada = await guardarImagenElectron(buffer, file.name);

      if (rutaGuardada) {
        // Actualizar ruta local con la nueva ruta guardada (añadiendo file://)
        const rutaCompleta = rutaGuardada.startsWith("file://") ? rutaGuardada : `file://${rutaGuardada}`;
        setRutaImagenLocal(rutaCompleta);
        console.log("Imagen guardada y ruta actualizada:", rutaCompleta);
      } else {
        console.warn("No se pudo guardar la imagen.");
        setRutaImagenLocal(null);
      }
    }
  };

  const abrirInput = () => {
    if (imagenTemporal) {
      setImagenTemporal(null);
      if (inputRef.current) inputRef.current.value = "";
    } else {
      inputRef.current?.click();
    }
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
              <img src="/img/icono_eliminar.png" onClick={() => {}} alt="Eliminar" />
              <img src="/img/icono_reset.png" onClick={() => {}} alt="Reset" />
              <img src="/img/icono_guardar.png" alt="Guardar" onClick={() => {}} />
            </div>
            <form>
              <label htmlFor="nombre">Nombre:</label>
              <input type="text" id="nombre" name="nombre" defaultValue={producto.nombre} />
              <label htmlFor="codigo">Código:</label>
              <input type="text" id="codigo" name="codigo" defaultValue={producto.codigo} />
              <label htmlFor="cantidad">Cantidad:</label>
              <input type="number" id="cantidad" name="cantidad" defaultValue={producto.cantidad} />
              <label htmlFor="precio">Precio:</label>
              <div className="contenedor-precio">
                <span className="simbolo-precio">$</span>
                <input
                  type="number"
                  id="precio"
                  name="precio"
                  step="1"
                  min="0"
                  placeholder="0.00"
                  defaultValue={producto.precio}
                />
              </div>
              <div className="ultimas-opciones">
                <div className="descripcion">
                  <label htmlFor="descripcion">Descripción:</label>
                  <textarea
                    placeholder="Escribe una descripción..."
                    className="descripcion"
                    defaultValue={producto.descripcion}
                  />
                </div>
                <div className="subir-imagen">
                  <div className="boton-imagen">
                    <label>Imagen:</label>
                    <button onClick={abrirInput} type="button">
                      {imagenTemporal ? "Quitar imagen" : "Subir imagen"}
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      ref={inputRef}
                      style={{ display: "none" }}
                    />
                  </div>
                  {/* Mostrar preferentemente la imagen temporal (blob), si no existe mostrar la imagen local */}
                  {(imagenTemporal || rutaImagenLocal) && (
                    <img
                      key={imagenTemporal || rutaImagenLocal} // forzar rerender si cambia
                      src={imagenTemporal || rutaImagenLocal || undefined}
                      alt="Imagen seleccionada"
                      style={{ maxWidth: "200px", marginTop: "10px" }}
                      onError={(e) => {
                        console.error("Error cargando imagen", e.currentTarget.src);
                        e.currentTarget.style.display = "none"; // Ocultar img si falla carga
                      }}
                    />
                  )}
                </div>
              </div>
            </form>
          </div>
        </section>
      </main>
    </Fragment>
  );
}
