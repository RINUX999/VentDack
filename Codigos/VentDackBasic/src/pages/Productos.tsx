import { Fragment } from "react/jsx-runtime";
import Header from "../components/Header";
import Navegacion from "../components/Navegacion";

import "../styles/Productos.css"
import ProductoTarjeta from "../components/ProductoTarjeta";

import { useProduct } from "../hooks/useProduct"
import { Link } from "react-router-dom";
export default function Productos() {

    const { productos, obtenerProducto } = useProduct()

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
                                <input type="text" title="" placeholder="Buscar" />
                            </div>
                            <select id="fruta" name="fruta">
                                <option value=""></option>
                                <option value="Con elementos">Con elementos</option>
                                <option value="Sin elementos">Sin elementos</option>
                            </select>
                            <img src="/img/icono_clear.png" alt="" />
                            <Link
                                to="/ProductoNuevo"
                                className="link">
                                <button>
                                    Nuevo
                                </button>
                            </Link>
                        </div>
                        <div className="contenedor-productos">
                            {productos.map((productoE) => {
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
