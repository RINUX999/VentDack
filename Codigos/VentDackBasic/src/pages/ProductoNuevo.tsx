import { Fragment } from "react/jsx-runtime";
import React, { useEffect, useRef, useState } from 'react';
import { Buffer } from 'buffer';
import Header from "../components/Header";
import Navegacion from "../components/Navegacion";
import "../styles/Producto.css";
import type { ProductoNuevo } from "../types/models_types";
import ModalProductoNuevo from "../components/ModalProductoNuevo";
import ModalError from "../components/ModalError";
import ModalExito from "../components/ModalExito";
import { v4 as uuidv4 } from 'uuid';
import ModalAdvertencia from "../components/ModalAdvertencia";

export default function ProductoNuevo() {
    //State de datos producto
    const [nombre, setNombre] = useState("");
    const [codigo, setCodigo] = useState("");
    const [cantidad, setCantidad] = useState<number | "">("");
    const [precio, setPrecio] = useState<number | "">("");
    const [descripcion, setDescripcion] = useState("");
    const [imagenURL, setImagenURL] = useState<string | null>(null);
    const [producto, setProducto] = useState<ProductoNuevo>({
        id: '',
        nombre: '',
        codigo: '',
        cantidad: 0,
        precio: 0,
        descripcion: '',
        url_img: ''
    });

    //States de la imagen
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [rutaImagenGuardada, setRutaImagenGuardada] = useState<string | null>(null);
    //Use state Modal
    //UseState de botones 
    const [modalGuardar, setModalGuardar] = useState(false);
    const [modalRegresarCambios, setModalRegresarCambios] = useState(false);
    //UseState de errores
    const [modalErrorNombre, setModalErrorNombre] = useState(false);
    const [modalErrorCantidad, setModalErrorCantidad] = useState(false);
    const [modalErrorPrecio, setModalErrorPrecio] = useState(false);
    //UseState de exito
    const [modalExitoActualizar, setModalExitoActualizar] = useState(false);

    // Guardar imagen usando buffer y nombre archivo
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
        if (file && file.type.startsWith('image/')) {
            const url = URL.createObjectURL(file);
            setImagenURL(url);
            /*
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const rutaGuardada = await guardarImagenElectron(buffer, file.name);
            // Solo actualiza si rutaGuardada NO es null
            if (rutaGuardada !== null) {
                setRutaImagenGuardada(rutaGuardada);
                console.log("Imagen guardada en:", rutaGuardada);
            } else {
                // Manejar error, por ejemplo limpiar ruta guardada
                setRutaImagenGuardada(null);
                console.warn("No se pudo guardar la imagen.");
            }*/
        }
    };



    const abrirInput = () => {
        if (imagenURL) {
            setImagenURL(null);
            inputRef.current!.value = '';
        } else {
            inputRef.current?.click();
        }
    };

    const procesarYGuardarImagen = async (): Promise<string | null> => {
        const file = inputRef.current?.files?.[0];
        if (!file || !file.type.startsWith('image/')) return null;
        try {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const ruta = await guardarImagenElectron(buffer, file.name);
            return ruta;
        } catch (error) {
            console.error("Error procesando o guardando imagen:", error);
            return null;
        }
    };



    //VALIDACIONES 

    const validaciones = (): boolean => {
        if (nombre === "") {
            setModalErrorNombre(true);
            return false;
        } else if (cantidad === "" || cantidad <= 0) {
            setModalErrorCantidad(true);
            return false;
        } else if (precio === "" || precio <= 0) {
            setModalErrorPrecio(true)
            return false;
        } else {
            return true
        }
    }

    const guardarProducto = () => {
        if (validaciones()) {
            setProducto({
                ...producto,     // copia todo el producto actual
                id: uuidv4(),    // genera un id nuevo
                nombre,
                codigo,
                cantidad: typeof cantidad === "number" ? cantidad : 0,
                precio: typeof precio === "number" ? precio : 0,
                descripcion,
            });
            setModalGuardar(true)
        }
    }

    const limpiarProducto=()=>{
        setNombre("")
        setCodigo("")
        setCantidad("")
        setPrecio("")
        setDescripcion("")
        setImagenURL(null)
        setModalRegresarCambios(false)
    }

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
                            <img src="/img/icono_clear.png"
                                onClick={() => setModalRegresarCambios(true)} alt="" />
                            <img src="/img/icono_guardar.png" alt=""
                                onClick={() => guardarProducto()} />
                        </div>
                        <form>
                            <label htmlFor="nombre"
                                onClick={() => setModalErrorNombre(true)}
                            >Nombre:</label>
                            <input
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                            />
                            <label htmlFor="codigo">Código:</label>
                            <input
                                type="text"
                                value={codigo}
                                onChange={(e) => setCodigo(e.target.value)}
                            />
                            <label htmlFor="cantidad">Cantidad:</label>
                            <input
                                type="number"
                                id="cantidad"
                                name="cantidad"
                                placeholder="0"
                                min="0"
                                value={cantidad}
                                onChange={(e) => {
                                    const valor = e.target.value;
                                    setCantidad(valor === "" ? "" : Number(valor));
                                }}
                            />
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
                                    value={precio}
                                    onChange={(e) => {
                                        const valor = e.target.value;
                                        setPrecio(valor === "" ? "" : Number(valor));
                                    }}
                                />
                            </div>
                            <div className="ultimas-opciones">
                                <div className="descripcion">
                                    <label htmlFor="descripcion">Descripción:</label>
                                    <textarea
                                        value={descripcion}
                                        onChange={(e) => setDescripcion(e.target.value)}
                                        placeholder="Escribe una descripción..."
                                        className="descripcion"

                                    />
                                </div>
                                <div className="subir-imagen">
                                    <div className="boton-imagen">
                                        <label>Imagen:</label>
                                        <button onClick={abrirInput} type="button">
                                            {imagenURL ? 'Quitar imagen' : 'Subir imagen'}
                                        </button>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            ref={inputRef}
                                            style={{ display: 'none' }}
                                        />
                                    </div>
                                    {imagenURL && (
                                        <img
                                            src={imagenURL}
                                            alt="Imagen seleccionada"
                                        />
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </section>

                <ModalExito
                    body="Producto Actualizado"
                    show={modalExitoActualizar}
                    onHide={() => setModalExitoActualizar(false)}
                />

                <ModalError
                    body="No ingresaste nombre"
                    show={modalErrorNombre}
                    onHide={() => setModalErrorNombre(false)}
                />
                <ModalError
                    body="La cantidad debe ser mayor que cero."
                    show={modalErrorCantidad}
                    onHide={() => setModalErrorCantidad(false)}
                />
                <ModalError
                    body="El precio debe ser mayor que cero."
                    show={modalErrorPrecio}
                    onHide={() => setModalErrorPrecio(false)}
                />
                <ModalProductoNuevo
                    titulo="¿Seguro de que quieres guardar los cambios? "
                    body="El producto será guardado."
                    textBoton="Guardar"
                    show={modalGuardar}
                    producto={producto}
                    procesarYGuardarImagen={procesarYGuardarImagen}
                    imagenURL={imagenURL}
                    onHide={() => setModalGuardar(false)}
                />
                <ModalAdvertencia
                    titulo="¿Seguro que quieres limpiar los campos? "
                    body="Los campos llenados para este producto seran borrados"
                    textBoton="Aceptar"
                    show={modalRegresarCambios}
                    onHide={() => setModalRegresarCambios(false)}
                    onConfirmar={()=>{ limpiarProducto() }}
                />
            </main>
        </Fragment>
    );
}
