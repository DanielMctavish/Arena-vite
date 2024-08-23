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

        <div className="painel-financ shadow-md shadow-black/40 absolute w-[954px] h-[400px] bg-[#3C4557] z-50 border border-[#C5D3EF] rounded-[10px] flex-col justify-around items-center text-white hidden">
            <span
                onClick={ClosePainelFinanc}
                className="absolute right-2 top-2 cursor-pointer w-[26px] h-[26px] rounded-full bg-gradient-to-tr from-[#FF0000] to-[#fe5b5b] border-[2px] border-white"></span>

            <h2 className="font-bold">RELATÓRIO GERAL FINANCEIRO</h2>

            <div className="w-[80%] flex justify-between items-center">
                <span>hoje</span>
                <span className="text-[#00FF47]">{resumeBalance.dailySum && formatoBRL.format(resumeBalance.dailySum)}</span>
            </div>

            <div className="w-[80%] flex justify-between items-center">
                <span>nesta semana</span>
                <span className="text-[#00FF47]">{resumeBalance.weeklySum && formatoBRL.format(resumeBalance.weeklySum)}</span>
            </div>

            <div className="w-[80%] flex justify-between items-center">
                <span>neste mês</span>
                <span className="text-[#00FF47]">{resumeBalance.monthlySum && formatoBRL.format(resumeBalance.monthlySum)}</span>
            </div>
            <hr className="w-full border-[1px] border-white" />

            <h2 className="font-bold">PERÍODO DE ENTRADAS</h2>

            <div className="w-[80%] flex justify-between items-center">
                <span>entre as datas</span>
                <input type="date" ref={refStartDate} className="bg-[#3C4557] border-[1px] border-white" />
                <input type="date" ref={refEndDate} className="bg-[#3C4557] border-[1px] border-white"
                    onChange={handleResumeBalanceRange} />
                <span className="text-[#00FF47]">{resumeBalanceRange && formatoBRL.format(resumeBalanceRange)}</span>
            </div>

        </div>

    )
}

export default RelatorioFinanceiro