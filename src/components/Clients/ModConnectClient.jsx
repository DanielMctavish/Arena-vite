import { Close } from "@mui/icons-material";
import { useEffect, useState } from "react";
import ComputerIcon from "../../medias/icons/iMac.png"
import axios from "axios";
import { useSelector } from "react-redux";

function ModConnectClient() {
    const [cardsMachines, setCardsMachines] = useState([1])
    const [currentMachine, setCurrentMachine] = useState()
    const [durations, setDurations] = useState(1)
    const [tax, setTax] = useState(3)
    const [taxInput, setTaxInput] = useState(false)

    const clientState = useSelector(state => state.client)

    useEffect(() => {
        getMachines()
    }, [])

    const handleCloseCurrentWindow = () => {
        const currentClientWindow = document.querySelector(".mod-connect-client");
        currentClientWindow.style.display = "none";
        setCurrentMachine('')
    }

    const getMachines = async () => {
        const currentSession = JSON.parse(localStorage.getItem('arena-adm-login'))

        try {

            const currentAdm = await axios.get(`${import.meta.env.VITE_APP_API_URL}/adm/admin-info-email?email=${currentSession.email}`, {
                headers: {
                    'Authorization': `Bearer ${currentSession.token}`
                }
            })

            await axios.get(`${import.meta.env.VITE_APP_API_URL}/adm/all-machines?adm_id=${currentAdm.data.id}`, {
                headers: {
                    'Authorization': `Bearer ${currentSession.token}`
                }
            }).then(result => {

                console.log("result -> ", result.data)
                setCardsMachines(result.data)

            })

        } catch (error) {
            console.log("error -> ", error.message)
        }
    }

    const handleSelectMachine = (currentMachine) => {
        console.log(currentMachine)
        setCurrentMachine(currentMachine)
    }

    const handleRunMachine = async () => {

    }

    return (
        <div className="lg:w-[60%] w-[90%] h-[58%] flex 
            bg-gradient-to-r from-[#3c4557b6] via-[#2a4a5a] to-[#19223498] 
            backdrop-blur-lg text-white rounded-md 
            justify-center items-center gap-6 relative p-2
            shadow-lg shadow-[#0f0f0f4d] overflow-y-auto">

            <span onClick={handleCloseCurrentWindow} className="absolute top-1 right-1 text-zinc-100 cursor-pointer z-10">
                <Close />
            </span>

            <section className="flex gap-1 w-[60%] h-[100%] bg-zinc-900 rounded-md  p-3 relative">

                <div className=" w-full flex flex-wrap  h-auto justify-center items-start  gap-1 overflow-y-auto">
                    {
                        cardsMachines.map((card, index) => {
                            return (
                                <div onClick={() => handleSelectMachine(card)} key={index} className="min-w-[140px] h-[140px]
                                hover:bg-emerald-200 flex justify-center items-center
                                bg-emerald-600 rounded-md cursor-pointer relative">
                                    <img src={ComputerIcon} alt="" />
                                    <span className="absolute text-[30px] mt-[-22px]">{index + 1}</span>
                                </div>
                            )
                        })
                    }
                </div>

            </section>

            <section className="flex flex-col w-[60%] h-[100%] p-4 gap-3 relative">

                <div className="w-full h-[40%] border-[1px] border-bg-white rounded-md flex flex-col justify-center items-center">

                    <span className="text-[14px]">cliente: {clientState.nome}</span>

                    <span className="font-bold text-[33px]">{currentMachine && currentMachine.nano_id}</span>
                    <span className="text-[12px]">{currentMachine && currentMachine.status}</span>

                </div>

                <div className="w-full h-[60%] border-[1px] relative p-1
                border-bg-white rounded-md flex flex-col justify-center items-center gap-6">


                    {
                        currentMachine &&
                        <>
                            <div className="flex w-full h-[40px] justify-between items- absolute top-0">
                                <button
                                    onClick={() => setTaxInput(!taxInput)}
                                    className="top-1 left-3 bg-[#162f3b] p-3 rounded-md text-[12px]">Definir tarifa</button>
                                {
                                    taxInput &&
                                    <div className="flex gap-2 justify-center items-center">
                                        <span className="text-[23px]">R$</span>
                                        <input type="number"
                                            onChange={(e) => e.target.value > 0 ? setTax(e.target.value) : false}
                                            value={tax}
                                            className="w-[80px] h-[40px] text-[23px] bg-transparent p-2 border-[1px] border-white/30 rounded-md" />
                                    </div>
                                }
                            </div>

                            <div className="flex w-full justify-between items-center">
                                <div className="flex gap-2 justify-center items-center">
                                    <input type="number"
                                        onChange={(e) => e.target.value > 0 ? setDurations(e.target.value) : false}
                                        value={durations}
                                        className="w-[80px] h-[40px] text-[33px] bg-transparent p-2 border-[1px] border-white/30 rounded-md" />
                                    <span className="font-bold text-[33px]">H</span>
                                </div>

                                <button className="flex w-[100px] h-[100px] shadow-lg shadow-[#20202051]
                                                justify-center items-center bg-[#219b37]
                                                border-[#97f7a8] border-[1px]
                                                text-white rounded-lg font-bold">
                                    PLAY
                                </button>

                                <span>R$ - {(tax * durations).toFixed(2)}</span>
                            </div>
                        </>
                    }

                </div>

            </section>

        </div>
    )
}

export default ModConnectClient;