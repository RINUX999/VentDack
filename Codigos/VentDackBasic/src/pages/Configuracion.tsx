import { Fragment } from "react/jsx-runtime";
import Navegacion from "../components/Navegacion";
import Header from "../components/Header";

import "../styles/Configuracion.css"

export default function Configuracion() {
    return (
        <Fragment>
            <main>
                <aside>
                    <Navegacion
                        pagina={"Configuracion"}
                    />
                </aside>
                <section>
                    <Header
                        pagina="Configuracion"
                    />
                    <div className="configuracion">
                        <p>
                            Nombre del Negocio:
                        </p>
                        <input type="text" placeholder="Nombre del negocio" />
                        <div className="boton">
                            <p>
                                Guardar
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        </Fragment>
    )
}
