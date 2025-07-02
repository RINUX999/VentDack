import { Fragment } from "react/jsx-runtime";


export default function TarjetaProductoVenta() {

    return (
        <Fragment>
            <div className="tarjeta-producto">
                <div className="tarjeta-arriba">
                    <p>
                        Brisa Urbana
                    </p>
                    <img src="/img/icono_remover.png" alt="" />
                </div>
                <div className="tarjeta-abajo">
                    <p>
                        $100
                    </p>
                    <p>
                        Cantidad: 10
                    </p>
                    <p>
                        Subtotal: $
                    </p>
                </div>
            </div>
        </Fragment>
    )

}
