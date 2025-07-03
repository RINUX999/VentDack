import { Fragment } from "react/jsx-runtime";
import "../styles/Inicio.css"
import Navegacion from "../components/Navegacion";
import Header from "../components/Header";
import { Link } from "react-router-dom";


export default function Inicio() {
    return (
        <Fragment>
            <main>
                <aside>
                    <Navegacion
                        pagina={"Inicio"}
                    />
                </aside>
                <section>
                    <Header
                        pagina="Inicio"
                    />
                    <div className="inicio-tarjetas">
                        <div className="inicio-tarjeta t1">
                            <Link to="/Ejemplo" className="link">
                            <p className="inicio-titulo-tarjeta">
                                Cantidad de Productos Registrados:
                            </p>
                            </Link>
                            <p className="inicio-dato-tarjeta">
                                100
                            </p>
                        </div>
                        <div className="inicio-tarjeta t2">
                            <p className="inicio-titulo-tarjeta">
                                Cantidad de Ventas:
                            </p>
                            <p className="inicio-dato-tarjeta">
                                100
                            </p>
                        </div>
                        <div className="inicio-tarjeta t3">
                            <p className="inicio-titulo-tarjeta">
                               Productos sin elementos:
                            </p>
                            <p className="inicio-dato-tarjeta">
                                100
                            </p>
                        </div>
                        <div className="inicio-tarjeta t4">
                            <p className="inicio-titulo-tarjeta">
                                Productos con elementos:
                            </p>
                            <p className="inicio-dato-tarjeta">
                                100
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        </Fragment>
    )
}