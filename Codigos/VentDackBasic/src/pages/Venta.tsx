import { Fragment } from "react/jsx-runtime";
import Navegacion from "../components/Navegacion";
import Header from "../components/Header";

import "../styles/Venta.css"
import InfoVenta from "../components/InfoVenta";

export default function Venta() {
    return (
        <Fragment>
            <main>
                <aside>
                    <Navegacion
                        pagina={"Venta"}
                    />
                </aside>
                <section>
                    <Header
                        pagina="Venta"
                    />
                    <div className="venta">
                        <p>
                            Fecha: 20 / Julio / 2025
                        </p>
                        <div className="productos-venta">
                            <div className="elemento">
                                <div className="caracteristica">
                                    <p>
                                        Producto:
                                    </p>
                                </div>
                                <div className="caracteristica">
                                    <p>
                                        Precio:
                                    </p>
                                </div>
                                <div className="caracteristica">
                                    <p>
                                        Cantidad:
                                    </p>
                                </div>

                                <div className="caracteristica">
                                    <p>
                                        Total:
                                    </p>
                                </div>
                            </div>
                            <InfoVenta />
                            <InfoVenta />
                            <InfoVenta />
                            <InfoVenta />
                            <InfoVenta />
                            <InfoVenta />
                            <InfoVenta />
                            <InfoVenta />
                            <InfoVenta />
                            <InfoVenta />
                            <InfoVenta />
                            <InfoVenta />


                        </div>
                        <div className="opciones-venta">
                            <div className="editar">
                                <p>
                                    Eliminar Venta
                                </p>
                                <p>
                                    Cancelar Venta
                                </p>
                            </div>
                            <div className="total">
                                <p>
                                    Total: $2000
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </Fragment>
    )
}
