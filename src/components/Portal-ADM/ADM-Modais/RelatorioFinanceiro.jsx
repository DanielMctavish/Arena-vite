/* eslint-disable react-hooks/exhaustive-deps */
import dayjs from 'dayjs'
import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function RelatorioFinanceiro() {
    const [resumeBalance, setResumeBalance] = useState([])
    const [resumeBalanceRange, setResumeBalanceRange] = useState()
    const currentSession = JSON.parse(localStorage.getItem("arena-adm-login"))


    useEffect(() => {
        getResumeBalance()
    }, [])
    const refStartDate = useRef()
    const refEndDate = useRef()

    const navigate = useNavigate()
    if (!currentSession) return navigate("/")

    function ClosePainelFinanc() {
        const currentPainel = document.querySelector(".painel-financ")
        currentPainel.style.display = 'none';
    }


    const getResumeBalance = async () => {

        try {
            await axios.get(`${import.meta.env.VITE_APP_API_URL}/transactions/resume-balance`, {
                headers: {
                    Authorization: `Bearer ${currentSession.token}`
                }
            }).then(result => {
                setResumeBalance(result.data)
            })
        } catch (error) {
            console.log("error at try catch resume")
        }

    }

    const handleResumeBalanceRange = async () => {
        try {

            let currentAdmin;

            await axios.get(`${import.meta.env.VITE_APP_API_URL}/adm/admin-info-email?email=${currentSession.email}`, {
                headers: {
                    'Authorization': `Bearer ${currentSession.token}`
                }
            }).then(result => {
                currentAdmin = result.data
            })

            await axios.get(`${import.meta.env.VITE_APP_API_URL}/transactions/resume-balance-range`, {
                params: {
                    adm_id: currentAdmin.id,
                    startDate: dayjs(refStartDate.current.value).format('YYYY-MM-DD'),
                    endDate: dayjs(refEndDate.current.value).format('YYYY-MM-DD')
                },
                headers: {
                    Authorization: `Bearer ${currentSession.token}`
                }
            }).then(result => {
                console.log('resultado: ', result.data)
                setResumeBalanceRange(result.data.rangeSum)
            })

        } catch (error) {
            console.log("error at try catch resume")
        }
    }

    const formatoBRL = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    })

    return (
        <div className="painel-financ fixed inset-0 flex items-center justify-center z-50">
            <div className="relative w-[954px] bg-[#1c2833] rounded-xl shadow-xl 
            border border-[#C5D3EF]/30 text-white p-8">
                {/* Botão Fechar */}
                <button
                    onClick={ClosePainelFinanc}
                    className="absolute right-4 top-4 w-8 h-8 rounded-full 
                    bg-gradient-to-r from-red-600 to-red-400 
                    border-2 border-white hover:opacity-80 transition-opacity 
                    flex items-center justify-center"
                >
                    <span className="text-white text-xl">&times;</span>
                </button>

                {/* Cabeçalho */}
                <h2 className="text-2xl font-bold text-center mb-8 text-[#e6a429]">
                    RELATÓRIO GERAL FINANCEIRO
                </h2>

                {/* Resumo Financeiro */}
                <div className="space-y-6 mb-8">
                    <div className="bg-[#243447] rounded-lg p-4 hover:bg-[#2a3c52] transition-colors">
                        <div className="flex justify-between items-center">
                            <span className="text-white/80">Hoje</span>
                            <span className="text-[#00FF47] font-mono text-lg">
                                {resumeBalance.dailySum && formatoBRL.format(resumeBalance.dailySum)}
                            </span>
                        </div>
                    </div>

                    <div className="bg-[#243447] rounded-lg p-4 hover:bg-[#2a3c52] transition-colors">
                        <div className="flex justify-between items-center">
                            <span className="text-white/80">Esta Semana</span>
                            <span className="text-[#00FF47] font-mono text-lg">
                                {resumeBalance.weeklySum && formatoBRL.format(resumeBalance.weeklySum)}
                            </span>
                        </div>
                    </div>

                    <div className="bg-[#243447] rounded-lg p-4 hover:bg-[#2a3c52] transition-colors">
                        <div className="flex justify-between items-center">
                            <span className="text-white/80">Este Mês</span>
                            <span className="text-[#00FF47] font-mono text-lg">
                                {resumeBalance.monthlySum && formatoBRL.format(resumeBalance.monthlySum)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-8" />

                {/* Seção de Período */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-center text-[#e6a429]">
                        PERÍODO DE ENTRADAS
                    </h2>

                    <div className="bg-[#243447] rounded-lg p-6">
                        <div className="flex items-center gap-4 flex-wrap">
                            <span className="text-white/80">Entre as datas:</span>
                            <div className="flex gap-4">
                                <input 
                                    type="date" 
                                    ref={refStartDate} 
                                    className="bg-[#1c2833] border border-[#C5D3EF]/30 rounded-lg 
                                    px-4 py-2 text-white focus:outline-none focus:border-[#e6a429] 
                                    transition-colors"
                                />
                                <input 
                                    type="date" 
                                    ref={refEndDate} 
                                    onChange={handleResumeBalanceRange}
                                    className="bg-[#1c2833] border border-[#C5D3EF]/30 rounded-lg 
                                    px-4 py-2 text-white focus:outline-none focus:border-[#e6a429] 
                                    transition-colors"
                                />
                            </div>
                            <span className="text-[#00FF47] font-mono text-lg ml-auto">
                                {resumeBalanceRange && formatoBRL.format(resumeBalanceRange)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RelatorioFinanceiro