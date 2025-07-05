import { useState } from "react";
import { Fragment } from "react/jsx-runtime";
import type { ProductoNuevo } from "../types/models_types";
import ModalError from "./ModalError";
import ModalAdvertencia from "./ModalAdvertencia";

type TarjetaProductoProps = {
    producto: ProductoNuevo
    productos: ProductoNuevo[]
    productosTicket: ProductoNuevo[]
    setProductosTicket: React.Dispatch<React.SetStateAction<ProductoNuevo[]>>;
}

export default function TarjetaProducto(
    { producto, productos, productosTicket, setProductosTicket }
        : TarjetaProductoProps) {

    const { nombre, cantidad, precio } = producto
    const [cantidadInput, setCantidadInput] = useState(1);
    const [modalErrorIntervalo, setModalErrorIntervalo] = useState(false)
    const [modalAdvertenciaProductoRepetido, setModalAdvertenciaErrorProductoRepetido] = useState(false)

    const cambiarCI = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value;
        if (/^\d*$/.test(valor)) {
            setCantidadInput(Number(valor || "0")); // evita NaN al borrar todo
        }
    };

    const aumentarCantidad = () => {
        if (cantidad) {
            if (cantidadInput < cantidad) {
                setCantidadInput(cantidadInput + 1)
            }
        }
    }

    const decrementarCantidad = () => {
        if (cantidadInput > 1) {
            setCantidadInput(cantidadInput - 1)
        }
    }

    const agregarElementoTicket = (nombre: string) => {
        if (!validacionCantidad()) return;

        const existeIndex = productosTicket.findIndex(p => p.nombre === nombre);

        if (existeIndex !== -1) {
            // El producto ya existe, puedes abrir la advertencia para actualizar cantidad
            setModalAdvertenciaErrorProductoRepetido(true);
        } else {
            // Producto no existe, agregar directamente
            setProductosTicket([...productosTicket, { ...producto, cantidad: cantidadInput }]);
        }
    };


    const validacionCantidad = (): boolean => {
        if (cantidad) {
            if (cantidadInput <= 0 || cantidadInput > cantidad) {
                setModalErrorIntervalo(true)
                return false
            }
        }
        return true
    }


    const cambiarCantidad = () => {
        const productosActualizados = productosTicket.map(p =>
            p.nombre === nombre ? { ...p, cantidad: cantidadInput } : p
        );
        setProductosTicket(productosActualizados);
        setModalAdvertenciaErrorProductoRepetido(false);
    };


    return (
        <Fragment>
            <div className="tarjeta-producto">
                <div className="tarjeta-arriba">
                    <p>
                        {nombre}
                    </p>
                    <img src="/img/icono_agregar.png" alt="" onClick={() => agregarElementoTicket(nombre)} />
                </div>
                <div className="tarjeta-abajo">
                    <p>
                        ${precio}
                    </p>
                    <p>
                        Cantidad:
                    </p>
                    <input type="text" value={cantidadInput} onChange={cambiarCI} />
                    <img src="/img/icono_agregar.png" alt="" onClick={() => aumentarCantidad()} />
                    <img src="/img/icono_remover.png" alt="" onClick={() => decrementarCantidad()} />
                    <p>
                        max: {cantidad}
                    </p>
                </div>
            </div>
            <ModalError
                body={`El valor debe estar entre 1 y ${cantidad} .`}
                show={modalErrorIntervalo}
                onHide={() => setModalErrorIntervalo(false)}
            />
            <ModalAdvertencia
                titulo="Producto ya agregado"
                body={`Este producto ya está en la compra. ¿Quieres reemplazar la cantidad?`}
                show={modalAdvertenciaProductoRepetido}
                textBoton="Aceptar"
                onHide={() => setModalAdvertenciaErrorProductoRepetido(false)}  // Cancelar
                onConfirmar={() => cambiarCantidad()}
            />

        </Fragment>
    )

}
