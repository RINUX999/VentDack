import { Fragment } from "react";

type InfoVentaProps = {
  producto: string;
  precio: number;
  cantidad: number;
  total: number;
};

export default function InfoVenta({ producto, precio, cantidad, total }: InfoVentaProps) {
  
    console.log(producto)

    return (

    <Fragment>
      <div className="elemento">
        <div className="caracteristica">
          <p>{producto}</p>
        </div>
        <div className="caracteristica">
          <p>${precio}</p>
        </div>
        <div className="caracteristica">
          <p>{cantidad}</p>
        </div>
        <div className="caracteristica">
          <p>${total}</p>
        </div>
      </div>
    </Fragment>
  );
}
