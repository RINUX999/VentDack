import { Fragment } from "react/jsx-runtime";


export default function TarjetaProducto() {

    return (
        <Fragment>
            <div className="tarjeta-producto">
                <div className="tarjeta-arriba">
                    <p>
                        Brisa Urbana
                    </p>
                    <img src="/img/icono_agregar.png" alt="" />
                </div>
                <div className="tarjeta-abajo">
                    <p>
                        $100
                    </p>
                    <p>
                        Cantidad:
                    </p>
                    <input type="text" defaultValue={1} placeholder="1" />
                    <img src="/img/icono_agregar.png" alt="" />
                    <img src="/img/icono_remover.png" alt="" />
                    <p>
                        max: 10
                    </p>
                </div>
            </div>
        </Fragment>
    )

}
