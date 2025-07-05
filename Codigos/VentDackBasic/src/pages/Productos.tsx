import { Fragment } from "react/jsx-runtime";
import Header from "../components/Header";
import Navegacion from "../components/Navegacion";

import "../styles/Productos.css"
import ProductoTarjeta from "../components/ProductoTarjeta";

import { useProduct } from "../hooks/useProduct"
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import type { ProductoNuevo } from "../types/models_types";
export default function Productos() {

    const { productos } = useProduct()
    const [productosBuscadosYFiltrados, setProductosBuscadosYFiltrados] = useState<ProductoNuevo[]>([])
    const [busqueda, setBusqueda] = useState('');
    const [filtroElementos, setFiltroElementos] = useState('');

    useEffect(() => {
        if (productos) {
            if (!busqueda || busqueda === "") {
                if (!filtroElementos || filtroElementos === "") {
                    setProductosBuscadosYFiltrados([...productos])
                } else {
                    if (filtroElementos === "Con elementos") {
                        const productosFYB = productos.filter(producto => (producto.cantidad ?? 0) > 0)
                        setProductosBuscadosYFiltrados([...productosFYB])
                    } else {
                        const productosFYB = productos.filter(producto => (producto.cantidad ?? 0) === 0)
                        setProductosBuscadosYFiltrados([...productosFYB])
                    }
                }
            } else {
                if (!filtroElementos || filtroElementos === "") {
                    const productosFYB = productos.filter(producto => (
                        producto.nombre.toLowerCase().startsWith(busqueda.toLowerCase()) ||
                        producto.codigo?.startsWith(busqueda)
                    ))
                    setProductosBuscadosYFiltrados([...productosFYB])
                } else {
                    if (filtroElementos === "Con elementos") {
                        const productosFYB = productos.filter(producto => (
                            (producto.cantidad ?? 0) > 0
                            && (
                                producto.nombre.toLowerCase().startsWith(busqueda.toLowerCase())
                                ||
                                producto.codigo?.startsWith(busqueda)
                            )
                        ))
                        setProductosBuscadosYFiltrados([...productosFYB])
                    } else {
                        const productosFYB = productos.filter(producto => (
                            (producto.cantidad ?? 0) === 0
                            &&
                            (producto.nombre.toLowerCase().startsWith(busqueda.toLowerCase())
                                ||
                                producto.codigo?.startsWith(busqueda)
                            )
                        ))
                        setProductosBuscadosYFiltrados([...productosFYB])
                    }
                }
            }
        }
    }, [productos, busqueda, filtroElementos])


    const buscar = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBusqueda(e.target.value)
    }

    const filtrar = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFiltroElementos(e.target.value)
    }

    const limpiar = ()=>{
        setBusqueda('')
        setFiltroElementos('')
    }

    return (
        <Fragment>
            <main>
                <aside>
                    <Navegacion
                        pagina={"Productos"}
                    />
                </aside>
                <section>
                    <Header
                        pagina="Productos"
                    />
                    <div className="ver-productos">
                        <div className="botones-elementales">
                            <div className="buscador">
                                <div className="buscar">
                                    <img src="/img/icono_search.png" alt="" />
                                </div>
                                <input type="text" title="" placeholder="Buscar"
                                    value={busqueda}
                                    onChange={buscar}
                                />
                            </div>
                            <select id="fruta" name="fruta" value={filtroElementos} onChange={filtrar}
                            >
                                <option value=""></option>
                                <option value="Con elementos">Con elementos</option>
                                <option value="Sin elementos">Sin elementos</option>
                            </select>
                            <img src="/img/icono_clear.png" alt="" className="clear" onClick={()=> limpiar()} />
                            <Link
                                to="/ProductoNuevo"
                                className="link">
                                <button>
                                    Nuevo
                                </button>
                            </Link>
                        </div>
                        <div className="contenedor-productos">
                            {
                                productosBuscadosYFiltrados.map((productoE) => {
                                    return (
                                        <ProductoTarjeta
                                            producto={productoE}
                                        />
                                    )
                                })
                            }
                        </div>
                    </div>
                </section>
            </main>
        </Fragment>
    )
}
