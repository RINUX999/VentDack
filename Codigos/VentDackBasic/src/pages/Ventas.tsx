import { Fragment } from "react/jsx-runtime";
import Navegacion from "../components/Navegacion";
import Header from "../components/Header";

import "../styles/Ventas.css"
import { Link } from "react-router-dom";

export default function Ventas() {
    return (
        <Fragment>
            <main>
                <aside>
                    <Navegacion
                        pagina={"Ventas"}
                    />
                </aside>
                <section>
                    <Header
                        pagina="Ventas"
                    />

                    <div className="ver-ventas">
                        <div className="buscador">
                            <p>
                                Fecha
                            </p>
                            <div className="eleccion">
                                <p>
                                    Año
                                </p>
                                <select id="Años" name="años">
                                    <option value=""></option>
                                    <option value="2025">2025</option>
                                    <option value="2026">2026</option>
                                    <option value="2027">2027</option>
                                    <option value="2028">2028</option>
                                    <option value="2029">2029</option>
                                    <option value="2030">2030</option>
                                </select>
                            </div>
                            <div className="eleccion">
                                <p>
                                    Mes
                                </p>
                                <select id="Meses" name="años">
                                    <option value=""></option>
                                    <option value="Enero">Enero</option>
                                    <option value="Febrero">Febrero</option>
                                    <option value="Marzo">Marzo</option>
                                    <option value="Abril">Abril</option>
                                    <option value="Mayo">Mayo</option>
                                    <option value="Junio">Junio</option>
                                    <option value="Julio">Julio</option>
                                    <option value="Agosto">Agosto</option>
                                    <option value="Septiembre">Septiembre</option>
                                    <option value="Octubre">Octubre</option>
                                    <option value="Septiembre">Noviembre</option>
                                    <option value="Octubre">Diciembre</option>
                                </select>
                            </div>
                            <div className="eleccion">
                                <p>
                                    Dia
                                </p>
                                <select id="Dias" name="dias">
                                    <option value=""></option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    <option value="9">9</option>
                                    <option value="10">10</option>
                                    <option value="11">11</option>
                                    <option value="12">12</option>
                                    <option value="13">13</option>
                                    <option value="14">14</option>
                                    <option value="15">15</option>
                                    <option value="16">16</option>
                                    <option value="17">17</option>
                                    <option value="18">18</option>
                                    <option value="19">19</option>
                                    <option value="20">20</option>
                                    <option value="21">21</option>
                                    <option value="22">22</option>
                                    <option value="23">23</option>
                                    <option value="24">24</option>
                                    <option value="25">25</option>
                                    <option value="26">26</option>
                                    <option value="27">27</option>
                                    <option value="28">28</option>
                                    <option value="29">29</option>
                                    <option value="30">30</option>
                                    <option value="31">31</option>
                                </select>
                            </div>
                            <img src="/img/icono_clear.png" alt="" />
                        </div>
                        <div className="contenedor-ventas">
                            <Link to="/Venta" className="link">
                                <div className="contenedor-venta">
                                    <p>
                                        Total: $2000
                                    </p>
                                    <div className="descripcion-venta">
                                        <p>
                                            Productos Vendidos: 10
                                        </p>
                                        <p>
                                            Fecha: 10 / Diciembre / 2025
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div className="cantidad-ventas">
                            <p>
                                Numero de ventas: 20
                            </p>
                            <p>
                                Total: $200
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        </Fragment>
    )
}
