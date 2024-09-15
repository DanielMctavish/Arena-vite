/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";
import Asside from "../../Asside/Asside";
import NavigationAdm from "../../navigation/Navigation";
import RelatorioFinanceiro from "../ADM-Modais/RelatorioFinanceiro";
import { useNavigate } from 'react-router-dom';
import { CreditCard, Pix } from "@mui/icons-material"; // Import icons
//import dayjs from "dayjs";

function Financial() {
    const [transactions, setTransactions] = useState([]);
    const [adminBalance, setAdminBalance] = useState(0); // State to hold admin balance
    const navigate = useNavigate();

    useEffect(() => {
        getAllTransactions();
        getAdminBalance(); // Fetch admin balance
    }, []);

    const getAllTransactions = async () => {
        const currentSession = JSON.parse(localStorage.getItem("arena-adm-login"));

        if (!currentSession) return navigate("/");

        try {
            let currentAdmin;

            await axios.get(`${import.meta.env.VITE_APP_API_URL}/adm/admin-info-email?email=${currentSession.email}`, {
                headers: {
                    'Authorization': `Bearer ${currentSession.token}`
                }
            }).then(result => {
                currentAdmin = result.data;
            });

            await axios.get(`${import.meta.env.VITE_APP_API_URL}/transactions/list-transactions?adm_id=${currentAdmin.id}`, {
                headers: {
                    'Authorization': `Bearer ${currentSession.token}`
                }
            }).then(result => {
                setTransactions(result.data);
            });

        } catch (error) {
            console.log("error at try get transactions -> ", error.message);
        }
    };

    const getAdminBalance = async () => {
        const currentSession = JSON.parse(localStorage.getItem("arena-adm-login"));

        if (!currentSession) return navigate("/");

        try {
            await axios.get(`${import.meta.env.VITE_APP_API_URL}/adm/admin-info-email?email=${currentSession.email}`, {
                headers: {
                    'Authorization': `Bearer ${currentSession.token}`
                }
            }).then(result => {
                setAdminBalance(result.data.saldo); // Assuming the balance is returned in the response
            });
        } catch (error) {
            console.log("error at try get admin balance -> ", error.message);
        }
    };

    function OpenPainelFinanc() {
        const currentPainel = document.querySelector(".painel-financ");
        currentPainel.style.display = 'flex';
    }

    return (
        <div className="bg-zinc-100 w-full h-[100vh] flex justify-center items-center border-[10px] border-[#e6a429]">
            <Asside />
            <NavigationAdm title="CAIXA" />
            <RelatorioFinanceiro />

            <div className="absolute top-[12vh] left-[33%] flex flex-col items-center">
                <span className="font-bold">REGISTRO DE ENTRADAS</span>
                <span className="text-lg font-semibold">Saldo: R$ {adminBalance.toFixed(2)}</span>
            </div>
            <button
                onClick={OpenPainelFinanc}
                className="absolute top-[12vh] right-[4%] bg-[#3C4557] w-[227px] h-[34px] text-white rounded-[6px] md:block hidden">relatório financeiro</button>

            <section className='absolute flex flex-wrap justify-center items-start gap-3 sm:w-[70%] 
            w-[94%] sm:max-h-[78vh] max-h-[72vh] sm:right-[3vh] right-auto top-[16vh] p-3 overflow-y-auto'>

                <table className="text-zinc-900 w-[90%]">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-2">Cliente</th>
                            <th className="p-2">Valor</th>
                            <th className="p-2">Tipo</th>
                            <th className="p-2">Método</th>
                            <th className="p-2">Status</th>
                            <th className="p-2">Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction, index) => {
                            console.log("Transaction: ", transaction); // Log each transaction
                            return (
                                <tr key={index} className="bg-white border-b hover:bg-gray-100">
                                    <td className="p-2 flex items-center">
                                        {transaction.Client ? (
                                            <>
                                                <img src={transaction.Client.avatar_url} alt="avatar" className="w-8 h-8 rounded-full mr-2 object-cover" />
                                                <span>{transaction.Client.nome}</span>
                                            </>
                                        ) : (
                                            <span>Cliente não encontrado</span>
                                        )}
                                    </td>
                                    <td className="p-2">R$ {transaction.value.toFixed(2)}</td>
                                    <td className="p-2">{transaction.transaction_type}</td>
                                    <td className="p-2">
                                        {transaction.method === 'PIX' ? <Pix /> : <CreditCard />}
                                    </td>
                                    <td className="p-2">{transaction.status}</td>
                                    <td className="p-2">{new Date(transaction.created_at).toLocaleDateString()}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

            </section>
        </div>
    );
}

export default Financial;