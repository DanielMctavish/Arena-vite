import { Close, PointOfSale, AccessTime } from "@mui/icons-material";
import axios from "axios"
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoadingComp from "../load/LoadingComp";

function ModAddSaldo({ changeState, setChangeState }) {
    const [transactionType, setTransactionType] = useState('SALDO')
    const [tarifa, setTarifa] = useState(0)
    const [hours, setHours] = useState(0)
    const [value, setValue] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [method, setMethod] = useState()
    const clientState = useSelector(state => state.client)

    const navigate = useNavigate("")

    const handleCloseCurrentWindow = () => {
        const currentClientWindow = document.querySelector(".mod-add-saldo-client");
        currentClientWindow.style.display = "none";
    }

    const handleAddValueToClient = async () => {
        const getAdmSession = JSON.parse(localStorage.getItem("arena-adm-login"))
        if (!getAdmSession) return navigate("/")


        setIsLoading(true)
        if (transactionType === 'SALDO') {
            if (!value || !method) {
                alert("Preencha todos os campos")
                return
            }
            if (value < 0) return alert("boa tentativa... ")
            try {

                const currentAdmin = await axios.get(`${import.meta.env.VITE_APP_API_URL}/adm/admin-info-email?email=${getAdmSession.email}`, {
                    headers: {
                        'Authorization': `Bearer ${getAdmSession.token}`
                    }
                })

                await axios.post(`${import.meta.env.VITE_APP_API_URL}/adm/add-credit`, {
                    value: parseFloat(value),
                    transaction_type: "MACHINE_CREDIT",
                    fluxo: 'IN',
                    method: method,
                    status: "APPROVED",
                    userAdmId: currentAdmin.data.id,
                    userClientId: clientState.client_id
                }, {
                    headers: {
                        'Authorization': `Bearer ${getAdmSession.token}`
                    }
                }).then(result => {
                    handleCloseCurrentWindow()
                    setChangeState(!changeState)
                    setIsLoading(false)
                })

            } catch (error) {
                setIsLoading(false)
                console.log("erro ao adicionar saldo -> ", error.message)
            }
        }

        if (transactionType === 'HOUR') {
            setIsLoading(true)
            if (hours <= 0 || tarifa <= 0) {
                setIsLoading(false)
                alert("valor inválido")
                return false
            }
            if (parseFloat(hours * tarifa) > parseFloat(clientState.value)) {
                alert("Saldo insuficiente para realizar a operação")
                setIsLoading(false)
                return false
            }

            try {
                const currentAdmin = await axios.get(`${import.meta.env.VITE_APP_API_URL}/adm/admin-info-email?email=${getAdmSession.email}`, {
                    headers: {
                        'Authorization': `Bearer ${getAdmSession.token}`
                    }
                })
                await axios.post(`${import.meta.env.VITE_APP_API_URL}/adm/add-hour`, {
                    value: parseFloat(tarifa * hours),
                    transaction_type: "MACHINE_CREDIT",
                    fluxo: 'OUT',
                    method: method,
                    status: "APPROVED",
                    userAdmId: currentAdmin.data.id,
                    userClientId: clientState.client_id
                }, {
                    params: {
                        horas: hours
                    },
                    headers: {
                        'Authorization': `Bearer ${getAdmSession.token}`
                    }
                }).then(() => {
                    // handleCloseCurrentWindow()
                    setChangeState(!changeState)
                    setIsLoading(false)
                })
            } catch (error) {
                setIsLoading(false)
                console.log("erro ao adicionar horas -> ", error.message)
            }


        }

    }

    useEffect(() => {
        console.log("estado atual do cliente -> ", clientState)
    }, [clientState])

    if (isLoading) {
        return (
            <div className="w-[60%] h-[88%] flex flex-col
        bg-gradient-to-t from-[#3C4557] to-[#192234]  text-white rounded-md 
        justify-center items-center gap-6 relative
        shadow-lg shadow-[#0f0f0f4d] overflow-y-auto">
                <span className="absolute top-[3vh]">adicionando saldo...</span>
                <LoadingComp />
            </div>
        )
    }

    return (
        <div className="w-[60%] h-[88%] flex flex-col
        bg-gradient-to-t from-[#3C4557] to-[#192234]  text-white rounded-md 
        justify-center items-center gap-6 relative
        shadow-lg shadow-[#0f0f0f4d] overflow-y-auto">

            <span onClick={handleCloseCurrentWindow} className="absolute top-1 right-1 text-zinc-100 cursor-pointer">
                <Close />
            </span>

            <span className="text-[32px] font-bold">{clientState && clientState.nome}</span>
            <img src={clientState && clientState.avatar_url} alt="" className="w-[120px] h-[120px] object-cover rounded-full bg-zinc-300" />

            <div className="flex justify-between items-center p-2 bg-transparent rounded-md w-[80%]">
                <span>Saldo Atual do Cliente:</span>
                <div>
                    <span className="text-[33px]">R$ {clientState.value && clientState.value.toFixed(2)}</span>
                    <span className="text-[#ff4a4a]">
                        {
                            hours > 0 &&
                            <span>- R$ {(hours * tarifa).toFixed(2)}</span>
                        }
                    </span>
                </div>
            </div>

            <div className="flex w-[80%] justify-center items-center gap-1">
                <div onClick={() => setTransactionType('SALDO')} className={`
                flex-1 text-center h-[40px] ${transactionType === 'SALDO' ? 'bg-[#7384a8]' : 'bg-[#3C4557] '}
                flex items-center justify-center rounded-md cursor-pointer hover:border-[1px]
                    `}>
                    SALDO
                </div>
                <div onClick={() => setTransactionType('HOUR')} className={`
                flex-1 text-center h-[40px] ${transactionType === 'HOUR' ? 'bg-[#7384a8]' : 'bg-[#3C4557] '}
                flex items-center justify-center rounded-md cursor-pointer hover:border-[1px]
                    `}>
                    HORAS
                </div>
            </div>

            {
                transactionType === 'HOUR' &&
                <div className="flex gap-3 justify-start items-center w-[80%]">
                    <div className="flex w-[50%] gap-1 justify-start items-center">
                        <PointOfSale />
                        <input onChange={(e) => { setTarifa(e.target.value) }}
                            type="text" className="p-2 border-[1px] bg-transparent rounded-md w-full"
                            placeholder="definir tarifa: R$ 0.00" />
                    </div>
                    <div className="flex w-[50%] gap-1 justify-start items-center">
                        <AccessTime />
                        <input onChange={(e) => { setHours(e.target.value) }}
                            type="text" className="p-2 border-[1px] bg-transparent rounded-md w-full"
                            placeholder="definir horas" />
                    </div>
                </div>
            }

            {transactionType === 'SALDO' &&
                <input onChange={(e) => { setValue(e.target.value) }}
                    type="text" className="p-2 border-[1px] bg-transparent rounded-md w-[80%]"
                    placeholder="saldo do cliente" />
            }

            <select onChange={(e) => setMethod(e.target.value)} name="" id="" className="p-2 border-[1px] bg-transparent rounded-md w-[80%]">
                <option value="">selecione</option>
                <option value="CREDITO">cartão de crédito</option>
                <option value="PIX">a vista ou pix</option>
            </select>

            <button onClick={handleAddValueToClient} className="p-2 bg-[#27314b] border-[1px] border-[#3e4e75] rounded-md w-[80%]">
                confirmar
            </button>

        </div>
    )
}

export default ModAddSaldo;