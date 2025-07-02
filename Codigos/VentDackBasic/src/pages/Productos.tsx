import { Fragment } from "react/jsx-runtime";
import Header from "../components/Header";
import Navegacion from "../components/Navegacion";

import "../styles/Productos.css"
import { Link } from "react-router-dom";

export default function Productos() {
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
                            <button>
                                Nuevo
                            </button>
                        </div>
                        <div className="contenedor-productos">
                            <Link to="/Producto" className="link">
                                <div className="contenedor-producto">
                                    <p>
                                        Brisa Urbana
                                    </p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </Fragment>
    )
}
