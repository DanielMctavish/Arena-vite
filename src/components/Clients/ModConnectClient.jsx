/* eslint-disable react-hooks/exhaustive-deps */
import { Close, PlayArrow, Stop } from "@mui/icons-material";
import { useEffect, useState } from "react";
import ComputerIcon from "../../medias/icons/iMac.png"
import axios from "axios";
import dayjs from "dayjs"
import { useDispatch, useSelector } from "react-redux";
import { machineRunning } from "../../redux/machines/MachineSlice";
import LoadingComp from "../load/LoadingComp";
import PS_logo from "../../medias/logos/PlayStation-Logo.png"
import Xbox_logo from "../../medias/logos/Xbox-Logo.png"

function ModConnectClient() {
    const [isLoading, setIsLoading] = useState(false)
    const [currentAdmin, setCurrentAdmin] = useState({})
    const [cardsMachines, setCardsMachines] = useState([1])
    const [currentMachine, setCurrentMachine] = useState()
    const [durations, setDurations] = useState(1)
    const [serverResponses, setServerResponses] = useState("")
    const [showModal, setShowModal] = useState(false)

    const clientState = useSelector(state => state.client)
    const dispatch = useDispatch()

    useEffect(() => {
        getMachines()

        // Adicionar event listener para a tecla Esc
        const handleEscKey = (event) => {
            if (event.key === "Escape") {
                handleCloseCurrentWindow();
            }
        };

        document.addEventListener("keydown", handleEscKey);

        // Remover event listener quando o componente for desmontado
        return () => {
            document.removeEventListener("keydown", handleEscKey);
        };
    }, [])

    const handleCloseCurrentWindow = () => {
        const currentClientWindow = document.querySelector(".mod-connect-client");
        currentClientWindow.style.display = "none";
        setCurrentMachine('')
    }

    const getMachines = async () => {
        const currentSession = JSON.parse(localStorage.getItem('arena-adm-login'))

        try {
            const getListMachines = async (admin) => {

                await axios.get(`${import.meta.env.VITE_APP_API_URL}/adm/all-machines?adm_id=${admin.id}`, {
                    headers: {
                        'Authorization': `Bearer ${currentSession.token}`
                    }
                }).then(result => {
                    // Ordenar as máquinas por posição
                    const sortedMachines = result.data.sort((a, b) => a.position - b.position);
                    setCardsMachines(sortedMachines)
                })
            }

            await axios.get(`${import.meta.env.VITE_APP_API_URL}/adm/admin-info-email?email=${currentSession.email}`, {
                headers: {
                    'Authorization': `Bearer ${currentSession.token}`
                }
            }).then((result) => {
                //console.log("result admin -> ", result.data)
                setCurrentAdmin(result.data)
                getListMachines(result.data)
            })

        } catch (error) {
            console.log("error -> ", error.message)
        }
    }

    const handleSelectMachine = (currentMachine) => {
        //console.log(currentMachine)
        setCurrentMachine(currentMachine)
    }

    const handleRunMachine = async () => {
        const currentSession = JSON.parse(localStorage.getItem('arena-adm-login'))

        try {
            // Verifica se o cliente tem horas suficientes
            const clientResponse = await axios.get(`${import.meta.env.VITE_APP_API_URL}/client/find?client_id=${clientState.client_id}`, {
                headers: {
                    'Authorization': `Bearer ${currentSession.token}`
                }
            });

            const clientData = clientResponse.data.body.horas;
            console.log("clientData -> ", clientData)
            if (clientData < parseFloat(durations)) {
                setShowModal(true);
                setIsLoading(false);
                return;
            }

            setIsLoading(true)
            await axios.post(`${import.meta.env.VITE_APP_API_URL}/machines/start-machine`, {
                duration: parseInt(durations) * 60,
                timer_started_at: dayjs().toDate(),
                timer_ended_at: dayjs().add(durations, 'hour').toDate(),
                status: 'RUNNING',
                adm_id: currentAdmin.id,
                client_id: clientState.client_id,
                local_id: currentMachine.arenaLocalId,
                machine_id: currentMachine.id
            }, {
                headers: {
                    'Authorization': `Bearer ${currentSession.token}`
                }
            }).then(result => {
                console.log("session created -> ", result.data)
                setIsLoading(false)
                dispatch(machineRunning(result.data))
                handleCloseCurrentWindow()
            }).catch(err => {
                console.log("error at create session -> ", err.response.data)
                setIsLoading(false)
                setServerResponses(err.response.data)
            })
        } catch (error) {
            console.log("error -> ", error.message)
            setIsLoading(false)
        }
    }

    const handleStopMachine = async () => {
        const currentSession = JSON.parse(localStorage.getItem('arena-adm-login'))
        //console.log("observando token = > ", currentSession.token)

        await axios.get(`${import.meta.env.VITE_APP_API_URL}/machines/stop-machine?machine_id=${currentMachine.id}`, {
            headers: {
                'Authorization': `Bearer ${currentSession.token}`
            }
        }).then(res => {
            console.log("Stopping machine -> ", res)
        }).catch(err => {
            console.log("error at stop machine -> ", err.message)
        })

    }

    const getBackgroundColor = (type) => {
        switch(type) {
            case 'PC':
                return '#3C4557';  // Cor original para PC
            case 'XBOX':
                return '#107C10';  // Verde do Xbox
            case 'PS5':
                return '#2E6DB4';  // Azul do PlayStation
            default:
                return '#3C4557';
        }
    }

    const getMachineIcon = (type) => {
        switch(type) {
            case 'PC':
                return ComputerIcon;
            case 'XBOX':
                return Xbox_logo;
            case 'PS5':
                return PS_logo;
            default:
                return ComputerIcon;
        }
    }

    if (isLoading) return (
        <div className="lg:w-[60%] w-[90%] h-[58%] flex 
            bg-gradient-to-r from-[#2c3e50] via-[#34495e] to-[#2c3e50] 
            backdrop-blur-lg text-white rounded-md 
            justify-center items-center gap-6 relative p-2
            shadow-lg shadow-[#0f0f0f4d] overflow-y-auto">
            <span className="fixed bottom-[2vh]">conectando máquina, aguarde...</span>
            <LoadingComp />
        </div>
    )

    return (
        <div className="lg:w-[60%] w-[90%] h-[58%] flex 
            bg-gradient-to-r from-[#2c3e50] via-[#34495e] to-[#2c3e50] 
            backdrop-blur-lg text-white rounded-md 
            justify-center items-center gap-6 relative p-2
            shadow-lg shadow-[#0f0f0f4d] overflow-y-auto mod-connect-client">

            <span onClick={handleCloseCurrentWindow} className="absolute top-1 right-1 text-zinc-100 cursor-pointer z-10">
                <Close />
            </span>

            {/* Modal de aviso */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                    <div className="bg-[#2c3e50] p-6 rounded-md shadow-md text-center text-white">
                        <h2 className="text-xl font-bold mb-4">Aviso de Conexão</h2>
                        <p>O cliente não tem horas suficientes.</p>
                        <button
                            onClick={() => setShowModal(false)}
                            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}

            {/*------------------------------------ SESSÃO DE MÁQUINAS DISPONÍVEIS --------------------------------------- */}
            <section className="flex gap-1 w-[60%] h-[100%] bg-[#1c2833] rounded-md p-3 relative">

                <div className="w-full flex flex-wrap h-auto justify-center items-start gap-1 overflow-y-auto">
                    {
                        cardsMachines.map((card) => {
                            const bgColor = getBackgroundColor(card.type);
                            const icon = getMachineIcon(card.type);
                            const isConsole = card.type === 'PS5' || card.type === 'XBOX';

                            if (card.status === "RUNNING") {
                                return (
                                    <div key={card.id} className="flex flex-col relative min-w-[140px] h-[140px]">
                                        <span className="bg-white text-zinc-600 mb-[-2px] 
                                        w-[80px] text-[12px] rounded-[2px] text-center">rodando</span>

                                        <div className="min-w-[130px] h-[130px] border-white border-[10px]
                                     flex justify-center items-center rounded-[2px]
                                     cursor-pointer relative"
                                     style={{ backgroundColor: bgColor }}>
                                            <span className={`absolute text-[22px] text-white
                                                ${isConsole ? 'top-1 left-1' : 'mt-[-22px]'}`}>
                                                {card.position}
                                            </span>
                                            <img src={icon} alt="" className="h-[50%] object-contain" style={{ filter: 'invert(1)' }} />
                                        </div>
                                    </div>
                                )
                            }

                            return (
                                <div onClick={() => handleSelectMachine(card)} 
                                     key={card.id} 
                                     className="min-w-[140px] h-[140px]
                                     hover:brightness-110 flex flex-col justify-center items-center
                                     rounded-md cursor-pointer relative"
                                     style={{ backgroundColor: bgColor }}>
                                    <img src={icon} alt="" className="h-[50%] object-contain" style={{ filter: 'invert(1)' }} />
                                    <span className={`absolute text-[22px] text-white
                                        ${isConsole ? 'top-1 left-1' : 'mt-[-4vh]'}`}>
                                        {card.position}
                                    </span>
                                    <span className="text-white">{card.nano_id}</span>
                                </div>
                            )
                        })
                    }
                </div>

            </section>

            <section className="flex flex-col w-[60%] h-[100%] p-4 gap-3 relative">

                <div className="w-full h-[40%] border-[1px] border-bg-white rounded-md flex flex-col justify-center items-center bg-[#1c2833] text-white">

                    <span className="text-[14px]">cliente: {clientState.nome}</span>

                    <span className="font-bold text-[33px]">{currentMachine && currentMachine.nano_id}</span>
                    <span className="text-[12px]">{currentMachine && currentMachine.status}</span>

                </div>

                <div className="w-full h-[60%] border-[1px] relative p-1
                border-bg-white rounded-md flex flex-col justify-center items-center gap-6 bg-[#1c2833] text-white">


                    {
                        currentMachine &&
                        <>

                            <div className="flex flex-col w-full justify-center items-center gap-4">
                                <div className="flex gap-2 justify-center items-center">
                                    <input type="number"
                                        onChange={(e) => e.target.value > 0 ? setDurations(e.target.value) : false}
                                        value={durations}
                                        className="w-[80px] h-[40px] text-[33px] bg-transparent p-2 border-[1px] border-white/30 rounded-md" />
                                    <span className="font-bold text-[33px]">H</span>
                                </div>

                                <div className="flex gap-4">
                                    {/* MACHINE CONTROLLERS */}
                                    <button
                                        onClick={handleRunMachine}
                                        className="flex w-[100px] h-[100px] shadow-lg shadow-[#20202051]
                                                    justify-center items-center bg-[#1e90ff]
                                                    border-[#87cefa] border-[1px]
                                                    text-white rounded-lg font-bold hover:bg-[#1c86ee]">
                                        <PlayArrow className="h-[40px] w-[40px]" />
                                    </button>
                                    <button
                                        onClick={handleStopMachine}
                                        className="flex w-[100px] h-[100px] shadow-lg shadow-[#20202051]
                                                    justify-center items-center bg-[#4682b4]
                                                    border-[#b0e0e6] border-[1px]
                                                    text-white rounded-lg font-bold hover:bg-[#4169e1]">
                                        <Stop className="h-[40px] w-[40px]" />
                                    </button>
                                </div>
                            </div>
                        </>
                    }

                </div>

            </section>

        </div>
    )
}

export default ModConnectClient;