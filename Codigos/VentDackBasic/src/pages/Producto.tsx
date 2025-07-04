import { Fragment } from "react/jsx-runtime";
import React, { useEffect, useRef, useState } from 'react';
import Header from "../components/Header";
import Navegacion from "../components/Navegacion";
import "../styles/Producto.css"
import { useLocation} from "react-router-dom";
import type { ProductoNuevo } from "../types/models_types";




export default function Producto() {

    //Elemento Recuperado
    const location = useLocation();
    const producto = location.state?.producto as ProductoNuevo;

    const inputRef = useRef<HTMLInputElement | null>(null);
    const [imagenURL, setImagenURL] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const url = URL.createObjectURL(file);
            setImagenURL(url);
        }
    };

    const abrirInput = () => {
        if (imagenURL) {
            // Si ya hay imagen → quitarla
            setImagenURL(null);
            inputRef.current!.value = ''; // limpia el input de archivos
        } else {
            // Si no hay imagen → abrir selector
            inputRef.current?.click();
        }
    };
    
    return (
        <Fragment>
            <main>
                <aside>
                    <Navegacion
                        pagina={"Producto"}
                    />
                </aside>
                <section>
                    <Header
                        pagina="Producto"
                    />

                    <div className="ver-producto">
                        <div className="opciones">
                            <img src="/img/icono_eliminar.png" alt="" />
                            <img src="/img/icono_reset.png" alt="" />
                            <img src="/img/icono_guardar.png" alt="" />
                        </div>
                        <form>
                            <label htmlFor="nombre">Nombre:{producto.nombre}</label>
                            <input type="text" id="nombre" name="nombre" />
                            <label htmlFor="nombre">Codigo:</label>
                            <input type="text" id="codigo" name="codigo" />
                            <label htmlFor="nombre">Cantidad:</label>
                            <input type="number" id="cantidad" name="cantidad" />
                            <label htmlFor="precio">Precio:</label>
                            <div className="contenedor-precio">
                                <span className="simbolo-precio">$</span>
                                <input
                                    type="number"
                                    id="precio"
                                    name="precio"
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="ultimas-opciones">
                                <div className="descripcion">
                                    <label htmlFor="nombre">Descripcion:</label>
                                    <textarea
                                        placeholder="Escribe una descripción..."
                                        className="descripcion"
                                    />
                                </div>
                                <div className="subir-imagen">
                                    <div className="boton-imagen">
                                        <label htmlFor="nombre">Imagen:</label>
                                        <button onClick={abrirInput}>
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
                                            style={{ maxWidth: '300px', marginTop: '1rem', borderRadius: '10px' }}
                                        />
                                    )}
                                </div>


                            </div>

                        </form>
                    </div>
                </section>
            </main>
        </Fragment>
    )
}