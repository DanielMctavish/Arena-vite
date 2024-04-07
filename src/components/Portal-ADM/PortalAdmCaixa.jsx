import React, { useEffect } from "react";
import Asside from "../Asside/Asside";
import NavigationAdm from "../navigation/Navigation";
import EntradaLinhaTd from "./ADM-components/EntradaLinhaTd";
import RelatorioFinanceiro from "./ADM-Modais/RelatorioFinanceiro";
import { useNavigate } from 'react-router-dom';
import dayjs from "dayjs";

function PortalAdmCaixa() {

    const navigate = useNavigate();

    useEffect(() => {
        const getCookie = localStorage.getItem('test-login')

        if (parseInt(getCookie) > dayjs().valueOf()) {
            return console.log('sessão válida');
        } else {
            return navigate("/adm-login")
        }

    })

    function OpenPainelFinanc() {
        const currentPainel = document.querySelector(".painel-financ")
        currentPainel.style.display = 'flex';
    }

    return (
        <div className="bg-zinc-100 w-full h-[100vh] flex justify-center items-center border-[10px] border-[#e6a429]">
            <Asside />
            <NavigationAdm title="CAIXA" />
            <RelatorioFinanceiro />

            <span className="absolute top-[12vh] left-[33%] font-bold">REGISTRO DE ENTRADAS</span>
            <button
                onClick={OpenPainelFinanc}
                className="absolute top-[12vh] right-[4%] bg-[#3C4557] w-[227px] h-[34px] text-white rounded-[6px] md:block hidden">relatório financeiro</button>

            <section className='absolute flex flex-wrap justify-center items-start gap-3 sm:w-[66%] w-[94%] sm:max-h-[88vh] max-h-[82vh] sm:right-[3vh] right-auto top-[16vh] p-3 overflow-y-auto'>
                <table className="text-zinc-900 w-[90%]">
                    <tr className="text-left">
                        <th>Nº</th>
                        <th>valor</th>
                        <th>usuário</th>
                        <th>data</th>
                    </tr>
                    <EntradaLinhaTd />
                    <EntradaLinhaTd />
                    <EntradaLinhaTd />
                    <EntradaLinhaTd />
                    <EntradaLinhaTd />
                    <EntradaLinhaTd />
                    <EntradaLinhaTd />
                    <EntradaLinhaTd />
                    <EntradaLinhaTd />
                    <EntradaLinhaTd />
                    <EntradaLinhaTd />
                    <EntradaLinhaTd />
                    <EntradaLinhaTd />
                    <EntradaLinhaTd />
                    <EntradaLinhaTd />
                    <EntradaLinhaTd />
                    <EntradaLinhaTd />
                </table>
            </section>
        </div>
    )
}

export default PortalAdmCaixa;