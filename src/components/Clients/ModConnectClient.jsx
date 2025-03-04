/* eslint-disable react-hooks/exhaustive-deps */
import { Close, PlayArrow } from "@mui/icons-material";
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
    const [hours, setHours] = useState(1)
    const [minutes, setMinutes] = useState(0)
    const [showModal, setShowModal] = useState(false)
    const [selectedMachineId, setSelectedMachineId] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

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
        setSelectedMachineId(currentMachine.id);
        setCurrentMachine(currentMachine);
    }

    const handleRunMachine = async () => {
        const currentSession = JSON.parse(localStorage.getItem('arena-adm-login'))

        try {
            // Calcula o total de minutos
            const totalMinutes = (hours * 60) + minutes;

            // Verifica se o cliente tem horas suficientes
            const clientResponse = await axios.get(`${import.meta.env.VITE_APP_API_URL}/client/find?client_id=${clientState.client_id}`, {
                headers: {
                    'Authorization': `Bearer ${currentSession.token}`
                }
            });

            const clientData = clientResponse.data.body.horas;
            // Converte totalMinutes para horas para comparação
            if (clientData < (totalMinutes / 60)) {
                setShowModal(true);
                setIsLoading(false);
                return;
            }

            setIsLoading(true)
            setErrorMessage('');
            
            await axios.post(`${import.meta.env.VITE_APP_API_URL}/machines/start-machine`, {
                duration: totalMinutes, // Enviando em minutos
                timer_started_at: dayjs().toDate(),
                timer_ended_at: dayjs().add(totalMinutes, 'minutes').toDate(),
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
                setIsLoading(false)
                
                // Atualiza o estado da máquina com o client_id
                const updatedMachine = {
                    ...result.data,
                    client_id: clientState.client_id
                };
                
                dispatch(machineRunning(updatedMachine))
                handleCloseCurrentWindow()
            }).catch(err => {
                setIsLoading(false)
                setErrorMessage(err.response?.data || 'Erro ao iniciar sessão');
                // Mostrar erro em um toast ou modal se necessário
            })

        } catch (error) {
            setIsLoading(false)
            setErrorMessage('Erro ao conectar com o servidor');
            // Mostrar erro em um toast ou modal se necessário
        }
    }

    // Função para atualizar durations quando hours ou minutes mudam
    const updateDurations = (h, m) => {
        setDurations(h + (m / 60));
    };

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
        <div className="w-[800px] flex 
            bg-gradient-to-r from-[#2c3e50] via-[#34495e] to-[#2c3e50] 
            backdrop-blur-lg text-white rounded-md 
            justify-center items-center gap-6 relative p-8
            shadow-lg shadow-[#0f0f0f4d]">
            <span className="fixed bottom-[2vh]">conectando máquina, aguarde...</span>
            <LoadingComp />
        </div>
    )

    return (
        <div className="w-[800px] 
        bg-gradient-to-br from-[#1c2833] to-[#2c3e50] 
        backdrop-blur-lg text-white rounded-xl z-[999]
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

            {/* Modal de erro */}
            {errorMessage && (
                <div className="fixed inset-0 bg-black/75 flex justify-center items-center z-50 backdrop-blur-sm">
                    <div className="bg-[#1c2833] p-8 rounded-xl shadow-xl border border-red-500/20 max-w-md">
                        <h2 className="text-2xl font-bold mb-4 text-red-500">Erro</h2>
                        <p className="text-white/80 text-lg">{errorMessage}</p>
                        <button
                            onClick={() => setErrorMessage('')}
                            className="mt-6 w-full py-3 bg-gradient-to-r from-red-600 to-red-500
                            text-white rounded-lg hover:opacity-90 transition-opacity
                            font-medium shadow-lg shadow-red-500/20"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}

            {/* Seção de Máquinas */}
            <section className="w-[60%] bg-[#141e2a]/50 rounded-xl p-6 
            border border-white/5 shadow-xl">
                <h2 className="text-xl font-bold mb-6 text-white/80">Máquinas Disponíveis</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 
                max-h-[400px] overflow-y-auto pr-2
                scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {cardsMachines.map((card) => {
                        const bgColor = getBackgroundColor(card.type);
                        const icon = getMachineIcon(card.type);
                        const isConsole = card.type === 'PS5' || card.type === 'XBOX';
                        const isSelected = selectedMachineId === card.id;

                        if (card.status === "RUNNING") {
                            return (
                                <div key={card.id} 
                                className={`relative group transition-all duration-300 
                                ${selectedMachineId ? 'opacity-40 scale-95' : ''}`}>
                                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2
                                    bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                                        Em Uso
                                    </div>
                                    <div className="h-[110px] border-2 border-red-500/50
                                    rounded-xl flex flex-col items-center justify-center
                                    bg-gradient-to-br from-red-500/20 to-transparent"
                                    style={{ backgroundColor: bgColor }}>
                                        <span className={`text-lg text-white/80
                                            ${isConsole ? 'self-start ml-3' : ''}`}>
                                            {card.position}
                                        </span>
                                        <img src={icon} alt="" 
                                            className="h-[40%] object-contain opacity-50" 
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
                                className={`rounded-xl cursor-pointer
                                transition-all duration-300 group
                                flex flex-col items-center justify-center
                                border border-white/10
                                relative overflow-hidden
                                ${isSelected 
                                    ? 'h-[130px] border-[#e6a429] shadow-lg shadow-[#e6a429]/20 scale-105 z-10' 
                                    : 'h-[110px] hover:border-[#e6a429] opacity-40 scale-95'
                                }
                                ${selectedMachineId && !isSelected ? 'hover:opacity-60' : ''}`}
                                style={{ backgroundColor: bgColor }}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br 
                                from-white/5 to-transparent transition-opacity duration-300
                                ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                                
                                <span className={`text-lg text-white/80
                                    ${isConsole ? 'self-start ml-3' : ''}`}>
                                    {card.position}
                                </span>
                                <img src={icon} alt="" 
                                    className={`h-[40%] object-contain transition-all duration-300
                                    ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`}
                                    style={{ filter: 'invert(1)' }} 
                                />
                                <span className={`text-white transition-all duration-300 mt-1
                                    ${isSelected ? 'text-sm' : 'text-xs opacity-60'}`}>
                                    {card.nano_id}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* Seção de Controles */}
            <section className="w-[38%] flex flex-col gap-6">
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
                    border border-white/5 shadow-xl flex flex-col">
                        <div className="flex flex-col items-center">
                            <h3 className="text-xl font-medium text-white mb-6">Duração da Sessão</h3>
                            
                            <div className="bg-[#1c2833] w-full max-w-[280px] rounded-xl p-5
                            border border-white/10 shadow-lg">
                                {/* Container dos Inputs */}
                                <div className="space-y-4">
                                    {/* Seleção de Horas */}
                                    <div className="relative group">
                                        <input 
                                            type="number"
                                            min="0"
                                            value={hours}
                                            onChange={(e) => {
                                                const h = Math.max(0, parseInt(e.target.value) || 0);
                                                setHours(h);
                                                updateDurations(h, minutes);
                                            }}
                                            className="w-full h-12 text-2xl bg-[#141e2a] text-center
                                            text-white font-medium focus:outline-none rounded-lg
                                            border-2 border-purple-500/10 focus:border-purple-500/50
                                            transition-all group-hover:border-purple-500/30"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2
                                        text-sm text-gray-400 font-medium">horas</span>
                                    </div>

                                    {/* Seleção de Minutos */}
                                    <div className="relative group">
                                        <input 
                                            type="number"
                                            min="0"
                                            max="59"
                                            value={minutes}
                                            onChange={(e) => {
                                                const m = Math.min(59, Math.max(0, parseInt(e.target.value) || 0));
                                                setMinutes(m);
                                                updateDurations(hours, m);
                                            }}
                                            className="w-full h-12 text-2xl bg-[#141e2a] text-center
                                            text-white font-medium focus:outline-none rounded-lg
                                            border-2 border-purple-500/10 focus:border-purple-500/50
                                            transition-all group-hover:border-purple-500/30"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2
                                        text-sm text-gray-400 font-medium">minutos</span>
                                    </div>
                                </div>

                                {/* Total em minutos */}
                                <div className="mt-3 text-center text-sm text-gray-500">
                                    Total: {(hours * 60) + minutes} min
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto pt-6">
                            <button
                                onClick={handleRunMachine}
                                disabled={durations === 0 && minutes === 0}
                                className="w-full h-12 bg-gradient-to-r from-green-600 to-green-500
                                rounded-lg flex items-center justify-center gap-2
                                hover:opacity-90 transition-all duration-300
                                shadow-lg shadow-green-500/20 group
                                disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <PlayArrow className="text-2xl group-hover:scale-110 transition-transform" />
                                <span className="text-base font-medium">Iniciar Sessão</span>
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