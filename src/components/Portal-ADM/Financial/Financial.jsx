/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";
import Asside from "../../Asside/Asside";
import NavigationAdm from "../../navigation/Navigation";
import RelatorioFinanceiro from "../ADM-Modais/RelatorioFinanceiro";
import { useNavigate } from 'react-router-dom';
import { CreditCard, Pix } from "@mui/icons-material"; // Import icons
//import dayjs from "dayjs";
import 'dayjs/locale/pt-br';

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

    // Função para formatar valor em Reais
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    return (
        <div className="bg-zinc-800 w-full h-[100vh] 
        flex justify-center items-center border-[10px] 
        border-[#e6a429] relative overflow-hidden">
            <nav className="w-[30%] h-[100vh] relative">
                <Asside />
            </nav>

            <section className="w-[70%] h-[100vh] relative p-3">
                <NavigationAdm title="CAIXA" />
                <RelatorioFinanceiro />

                <div className="absolute flex flex-col w-full h-full top-[16vh] p-1 
                overflow-y-auto scrollbar scrollbar-thumb-[#18212f] scrollbar-track-gray-100">
                    {/* Header com Saldo e Botão de Relatório */}
                    <div className="flex justify-between items-center w-[98%] mb-4 bg-zinc-800/50 backdrop-blur-[12px] p-4 rounded-lg">
                        <div className="flex flex-col text-white">
                            <span className="text-gray-300">REGISTRO DE ENTRADAS</span>
                            <span className="text-2xl font-bold">
                                Saldo: {formatCurrency(adminBalance)}
                            </span>
                        </div>
                        <button
                            onClick={OpenPainelFinanc}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Relatório Financeiro
                        </button>
                    </div>

                    {/* Tabela de Transações */}
                    <div className="w-[98%] bg-zinc-800/50 backdrop-blur-[12px] rounded-lg overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-purple-500/30">
                                    <th className="p-4 text-left text-white">Cliente</th>
                                    <th className="p-4 text-white">Valor</th>
                                    <th className="p-4 text-white">Tipo</th>
                                    <th className="p-4 text-white">Método</th>
                                    <th className="p-4 text-white">Status</th>
                                    <th className="p-4 text-white">Data</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((transaction, index) => (
                                    <tr key={index} className="border-b border-purple-500/10 hover:bg-white/5 transition-colors">
                                        <td className="p-4 text-white flex items-center gap-2">
                                            {transaction.Client ? (
                                                <>
                                                    <img 
                                                        src={transaction.Client.avatar_url} 
                                                        alt="avatar" 
                                                        className="w-8 h-8 rounded-full object-cover" 
                                                    />
                                                    <span>{transaction.Client.nome}</span>
                                                </>
                                            ) : (
                                                <span>Cliente não encontrado</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-white text-center">
                                            {formatCurrency(transaction.value)}
                                        </td>
                                        <td className="p-4 text-white text-center">
                                            {transaction.transaction_type}
                                        </td>
                                        <td className="p-4 text-white text-center">
                                            {transaction.method === 'PIX' ? (
                                                <Pix className="text-green-400" />
                                            ) : (
                                                <CreditCard className="text-blue-400" />
                                            )}
                                        </td>
                                        <td className="p-4 text-white text-center">
                                            {transaction.status}
                                        </td>
                                        <td className="p-4 text-white text-center">
                                            {new Date(transaction.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Financial;