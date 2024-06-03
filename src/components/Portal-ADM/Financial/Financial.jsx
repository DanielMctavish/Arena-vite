/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";
import Asside from "../../Asside/Asside";
import NavigationAdm from "../../navigation/Navigation";
import EntradaLinhaTd from "../ADM-components/EntradaLinhaTd";
import RelatorioFinanceiro from "../ADM-Modais/RelatorioFinanceiro";
import { useNavigate } from 'react-router-dom';
//import dayjs from "dayjs";

function Financial() {
    const [transactions, setTransactions] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        getAllTransactions()
    }, [])

    const getAllTransactions = async () => {
        const currentSession = JSON.parse(localStorage.getItem("arena-adm-login"))

        if (!currentSession) return navigate("/")

        try {

            await axios.get(`${import.meta.env.VITE_APP_API_URL}/transactions/list-transactions`, {
                headers: {
                    'Authorization': `Bearer ${currentSession.token}`
                }
            }).then(result => {
                setTransactions(result.data)
            })

        } catch (error) {
            console.log("error at try get transactions -> ", error.message)
        }

    }

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

            <section className='absolute flex flex-wrap justify-center items-start gap-3 sm:w-[70%] w-[94%] sm:max-h-[88vh] max-h-[82vh] sm:right-[3vh] right-auto top-[16vh] p-3 overflow-y-auto'>
                <table className="text-zinc-900 w-[90%]">
                    <tr className="text-left">
                        <th>Nº</th>
                        <th>usuário</th>
                        <th>valor</th>
                        <th>tipo</th>
                        <th>forma de pagamento</th>
                        <th>status</th>
                        <th>data</th>
                    </tr>

                    {
                        transactions.map((transaction, index) => (
                            <EntradaLinhaTd key={index}
                                position={index}
                                id={transaction.id}
                                user_id={transaction.userClientId}
                                value={transaction.value}
                                type={transaction.transaction_type}
                                payment_method={transaction.method}
                                status={transaction.status}
                                date={transaction.created_at}
                            />
                        ))
                    }

                </table>
            </section>
        </div>
    )
}

export default Financial;