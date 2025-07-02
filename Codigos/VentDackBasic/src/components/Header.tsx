import { Fragment } from "react/jsx-runtime";

type HeaderProps = {
    pagina:string
}

export default function Header({pagina}:HeaderProps) {
    return (
        <Fragment>
            <h1>
                VentDack
            </h1>
            <h2>
                {pagina}
            </h2>
        </Fragment>
    )
}
