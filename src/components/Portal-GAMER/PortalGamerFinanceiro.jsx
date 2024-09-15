import React from "react";
import AssideGamer from './GAMER-components/AssideGamer';
import backgroundPortal from "../../medias/backgrounds/elden-ring-godfrey.png"

function PortalGamerFinanceiro() {
    return (
        <div id='portal-gamer-financeiro' className="bg-gradient-to-br from-purple-900 p-2 gap-2
        via-indigo-900 to-blue-900 w-full h-[100vh] flex relative border-[10px] border-[#7300F4]">
            <img src={backgroundPortal} alt="backgroundPortal"
                className='absolute top-0 left-0 w-full h-full object-cover opacity-30 blur-[4px]' />

            <AssideGamer />

            <section className='flex flex-col sm:w-[70%] w-full h-full 
          justify-start items-center relative bg-black/30
          rounded-[10px] backdrop-blur-lg gap-4 overflow-y-auto p-6'>

                {/* Header */}
                <div className='w-full flex justify-between items-center mb-6'>
                    <h2 className="text-3xl font-bold text-white">Portal Financeiro</h2>
                    <button className="px-5 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition">
                        Adicionar Horas
                    </button>
                </div>

                {/* Recent Transactions */}
                <div className='w-full bg-white/10 text-white rounded-lg p-6 backdrop-filter backdrop-blur-md'>
                    <h3 className="text-2xl mb-4">Transações Recentes</h3>
                    <table className="w-full text-left">
                        <thead>
                            <tr>
                                <th className="py-2">Data</th>
                                <th className="py-2">Pagamento</th>
                                <th className="py-2">Status</th>
                                <th className="py-2">Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="bg-white/20">
                                <td className="py-2">17 de junho de 2023</td>
                                <td className="py-2">Pix</td>
                                <td className="py-2 text-green-400">Concluído</td>
                                <td className="py-2">R$ 30,00</td>
                            </tr>
                            {/* Adicione mais linhas conforme necessário */}
                        </tbody>
                    </table>
                </div>

            </section>
        </div>
    )
}

export default PortalGamerFinanceiro;