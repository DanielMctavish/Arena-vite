import React from "react";
import Draggable from "react-draggable";

function RelatorioFinanceiro() {

    function ClosePainelFinanc() {
        const currentPainel = document.querySelector(".painel-financ")
        currentPainel.style.display = 'none';
    }


    return (
        <>
            <Draggable>
                <div className="painel-financ shadow-md shadow-black/40 absolute w-[954px] h-[400px] bg-[#3C4557] z-50 border border-[#C5D3EF] rounded-[10px] flex-col justify-around items-center text-white hidden">
                    <span
                        onClick={ClosePainelFinanc}
                        className="absolute right-2 top-2 cursor-pointer w-[26px] h-[26px] rounded-full bg-gradient-to-tr from-[#FF0000] to-[#fe5b5b] border-[2px] border-white"></span>

                    <h2 className="font-bold">RELATÓRIO GERAL FINANCEIRO</h2>

                    <div className="w-[80%] flex justify-between items-center">
                        <span>hoje</span>
                        <span className="text-[#00FF47]">R$ 350,00</span>
                    </div>

                    <div className="w-[80%] flex justify-between items-center">
                        <span>nesta semana</span>
                        <span className="text-[#00FF47]">R$ 4250,00</span>
                    </div>

                    <div className="w-[80%] flex justify-between items-center">
                        <span>neste mês</span>
                        <span className="text-[#00FF47]">R$ 25250,00</span>
                    </div>
                    <hr className="w-full border-[1px] border-white" />

                    <h2 className="font-bold">PERÍODO DE ENTRADAS</h2>

                    <div className="w-[80%] flex justify-between items-center">
                        <span>entre as datas</span>
                        <input type="date" name="" id="" className="bg-[#3C4557] border-[1px] border-white" />
                        <input type="date" name="" id="" className="bg-[#3C4557] border-[1px] border-white" />
                        <span className="text-[#00FF47]">R$ 25250,00</span>
                    </div>

                </div>
            </Draggable >
        </>
    )
}

export default RelatorioFinanceiro