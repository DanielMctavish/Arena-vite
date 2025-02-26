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
            if (clientData < parseFloat(durations)) {
                setShowModal(true);
                setIsLoading(false);
                return;
            }

            setIsLoading(true)
            
            // Inicia a sessão com a rota existente
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
                
                // Atualiza o estado da máquina com o client_id
                const updatedMachine = {
                    ...result.data,
                    client_id: clientState.client_id
                };
                
                dispatch(machineRunning(updatedMachine))
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
        <div className="lg:w-[80%] w-[95%] h-[70%] 
        bg-gradient-to-br from-[#1c2833] to-[#2c3e50] 
        backdrop-blur-lg text-white rounded-xl 
        flex justify-between items-stretch relative p-6
        shadow-2xl border border-white/10 mod-connect-client">
            {/* Botão Fechar */}
            <button 
                onClick={handleCloseCurrentWindow} 
                className="absolute top-4 right-4 p-2 hover:bg-white/10 
                rounded-lg transition-colors duration-200"
            >
                <Close className="text-white/60 hover:text-white" />
            </button>

            {/* Modal de aviso de horas insuficientes */}
            {showModal && (
                <div className="fixed inset-0 bg-black/75 flex justify-center items-center z-50 backdrop-blur-sm">
                    <div className="bg-[#1c2833] p-8 rounded-xl shadow-xl border border-red-500/20 max-w-md">
                        <h2 className="text-2xl font-bold mb-4 text-red-500">Aviso de Conexão</h2>
                        <p className="text-white/80 text-lg">O cliente não tem horas suficientes.</p>
                        <button
                            onClick={() => setShowModal(false)}
                            className="mt-6 w-full py-3 bg-gradient-to-r from-red-600 to-red-500
                            text-white rounded-lg hover:opacity-90 transition-opacity
                            font-medium shadow-lg shadow-red-500/20"
                        >
                            Entendi
                        </button>
                    </div>
                </div>
            )}

            {/* Seção de Máquinas */}
            <section className="w-[60%] h-full bg-[#141e2a]/50 rounded-xl p-6 
            border border-white/5 shadow-xl">
                <h2 className="text-xl font-bold mb-6 text-white/80">Máquinas Disponíveis</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 
                h-[calc(100%-3rem)] overflow-y-auto pr-2
                scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {cardsMachines.map((card) => {
                        const bgColor = getBackgroundColor(card.type);
                        const icon = getMachineIcon(card.type);
                        const isConsole = card.type === 'PS5' || card.type === 'XBOX';

                        if (card.status === "RUNNING") {
                            return (
                                <div key={card.id} 
                                className="relative group transition-all duration-300">
                                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2
                                    bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                                        Em Uso
                                    </div>
                                    <div className="h-[140px] border-2 border-red-500/50
                                    rounded-xl flex flex-col items-center justify-center
                                    bg-gradient-to-br from-red-500/20 to-transparent"
                                    style={{ backgroundColor: bgColor }}>
                                        <span className={`text-xl text-white/80
                                            ${isConsole ? 'self-start ml-3' : ''}`}>
                                            {card.position}
                                        </span>
                                        <img src={icon} alt="" 
                                            className="h-1/2 object-contain opacity-50" 
                                            style={{ filter: 'invert(1)' }} 
                                        />
                                    </div>
                                </div>
                            )
                        }

                        return (
                            <div 
                                onClick={() => handleSelectMachine(card)}
                                key={card.id}
                                className="h-[140px] rounded-xl cursor-pointer
                                transition-all duration-300 group hover:scale-105
                                flex flex-col items-center justify-center
                                border border-white/10 hover:border-[#e6a429]
                                relative overflow-hidden"
                                style={{ backgroundColor: bgColor }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br 
                                from-white/5 to-transparent opacity-0 group-hover:opacity-100 
                                transition-opacity duration-300" />
                                
                                <span className={`text-xl text-white/80
                                    ${isConsole ? 'self-start ml-3' : ''}`}>
                                    {card.position}
                                </span>
                                <img src={icon} alt="" 
                                    className="h-1/2 object-contain transition-transform 
                                    duration-300 group-hover:scale-110" 
                                    style={{ filter: 'invert(1)' }} 
                                />
                                <span className="text-white/60 text-sm mt-2">
                                    {card.nano_id}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* Seção de Controles */}
            <section className="w-[38%] h-full flex flex-col gap-6">
                {/* Painel do Cliente */}
                <div className="bg-[#141e2a]/50 rounded-xl p-6 border border-white/5 shadow-xl">
                    <h3 className="text-white/60 mb-2">Cliente Selecionado</h3>
                    <div className="flex items-center gap-4">
                        <img src={clientState.avatar_url} alt="" 
                            className="w-12 h-12 rounded-full object-cover border-2 border-white/20" 
                        />
                        <div>
                            <h4 className="text-lg font-bold">{clientState.nome}</h4>
                            <p className="text-[#e6a429]">
                                {currentMachine && currentMachine.nano_id}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Painel de Controle */}
                {currentMachine && (
                    <div className="flex-1 bg-[#141e2a]/50 rounded-xl p-6 
                    border border-white/5 shadow-xl flex flex-col justify-between">
                        <div>
                            <h3 className="text-white/60 mb-4">Duração da Sessão</h3>
                            <div className="flex items-center justify-center gap-4 mb-8">
                                <input 
                                    type="number"
                                    min="1"
                                    onChange={(e) => e.target.value > 0 ? setDurations(e.target.value) : false}
                                    value={durations}
                                    className="w-24 h-16 text-3xl bg-[#1c2833] text-center
                                    border border-white/20 rounded-lg focus:border-[#e6a429]
                                    focus:outline-none transition-colors"
                                />
                                <span className="text-3xl font-light">horas</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={handleRunMachine}
                                className="h-20 bg-gradient-to-r from-green-600 to-green-500
                                rounded-xl flex items-center justify-center gap-2
                                hover:opacity-90 transition-all duration-300
                                shadow-lg shadow-green-500/20 group"
                            >
                                <PlayArrow className="text-3xl group-hover:scale-110 transition-transform" />
                                <span className="font-medium">Iniciar</span>
                            </button>
                            
                            <button
                                onClick={handleStopMachine}
                                className="h-20 bg-gradient-to-r from-red-600 to-red-500
                                rounded-xl flex items-center justify-center gap-2
                                hover:opacity-90 transition-all duration-300
                                shadow-lg shadow-red-500/20 group"
                            >
                                <Stop className="text-3xl group-hover:scale-110 transition-transform" />
                                <span className="font-medium">Parar</span>
                            </button>
                        </div>
                    </div>
                )}
            </section>

            {/* Loading State */}
            {isLoading && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm
                flex flex-col items-center justify-center rounded-xl">
                    <div className="animate-spin rounded-full h-12 w-12 
                    border-t-2 border-b-2 border-white"></div>
                    <p className="mt-4 text-white/80">Conectando máquina...</p>
                </div>
            )}
        </div>
    )
}

export default ModConnectClient;