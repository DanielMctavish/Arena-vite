import React from "react";


function PortalGamerFinanceiro() {
    return (
        <div className="bg-zinc-200 w-full h-[100vh] flex flex-col justify-start items-center">
            <nav style={{
                border: '1px solid #C089FF',
                background: 'linear-gradient(90deg, #6E01E9 0%, #045B8C 29.55%, #7A2DD1 69.70%, #AD64FF 100%)',
                boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
            }} className="w-full h-[97px]"></nav>

            <section style={{ fontFamily: 'Goldman' }} className="flex justify-between items-center gap-3 w-full p-4">
                <h2 className="sm:text-[30px] text-[18px] text-left text-zinc-600">PAINEL FINANCEIRO</h2>
                <button>voltar</button>
            </section>

            <section
                className="flex sm:justify-between justify-center items-center gap-3 w-full p-4">
                <div className="w-[441px] h-[138px] bg-zinc-100 rounded-[10px] shadow-black/40 shadow-md sm:flex hidden"></div>
                <div className="w-[441px] h-[138px] bg-zinc-100 rounded-[10px] shadow-black/40 shadow-md sm:flex hidden"></div>
                <div className="sm:w-[441px] w-[98%] h-[138px] bg-[#984EEC] rounded-[10px] shadow-black/40 shadow-md"></div>
            </section>

            <div className="w-full h-[60px] p-3 text-[24px]"><h2>COMPRAS RECENTES</h2></div>
            <hr className="w-full boder-b-[1px] border-zinc-400" />

            <table className="w-[98%]">

                <tr className="w-full text-zinc-500">
                    <th>data</th>
                    <th>pagamento</th>
                    <th>status</th>
                    <th>valor</th>
                </tr>

                <tr className="text-center bg-white text-zinc-500 h-[98px] shadow-black/30 shadow-md ">
                    <td>17 de junho de 2023</td>
                    <td>pix</td>
                    <td className="text-[#009D48]">concluído</td>
                    <td>R$ 30,00</td>
                </tr>

            </table>
        </div>
    )
}


export default PortalGamerFinanceiro