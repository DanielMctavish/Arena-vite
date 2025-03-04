/* eslint-disable no-unreachable */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import axios from "axios"
import ComputerIcon from "../../../medias/icons/iMac.png"
import PS_logo from "../../../medias/logos/PlayStation-Logo.png"
import Xbox_logo from "../../../medias/logos/Xbox-Logo.png"

import ClockIcon from "../../../medias/icons/Wall Clock.png"
import DeleteIcon from "../../../medias/icons/Delete.png"
import { SyncDisabled, Sync, StopCircle } from "@mui/icons-material"
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { machineToDelete, machineRunning } from "../../../redux/machines/MachineSlice";
import connectWebSocketClient from "../../SocketCOM/connectWebSocket";

function CardMachine({ machine, index }) {
    const [currentClient, setCurrentClient] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [elapsedTime, setElapsedTime] = useState(0);
    const [playColor, setPlayColor] = useState('#3C4557')
    const [machineStatus, setMachineStatus] = useState('')
    const [showStoppedMessage, setShowStoppedMessage] = useState(false);

    const refCard = useRef()
    const dispatch = useDispatch()

    const socketClient = new connectWebSocketClient()

    useEffect(() => {
        getCurrentClient()
    }, [])

    useEffect(() => {
        const socket = socketClient.getSocketInstance();

        socket.on(`${machine.id}-running`, (message) => {
            setElapsedTime(message.data.cronTimer);
        });

        socket.on(`${machine.id}-stopped`, () => {
            setShowStoppedMessage(true);
            setElapsedTime(0);
            setMachineStatus({
                status: 'CONECTED',
                color: 'rgb(23, 250, 137)'
            });
            
            setPlayColor('#3C4557');
            const currentCard = refCard.current;
            if (currentCard) {
                currentCard.style.border = "1px solid #80c4cd";
                currentCard.style.filter = "brightness(100%)";
                currentCard.style.background = getBackgroundColor();
            }
            
            setTimeout(() => {
                setShowStoppedMessage(false);
            }, 3000);
        });

        return () => {
            socket.off(`${machine.id}-running`);
            socket.off(`${machine.id}-stopped`);

            if (machine.status === "RUNNING") {
                const currentCard = refCard.current;
                if (currentCard) {
                    currentCard.style.border = "3px solid #00cccc";
                    currentCard.style.filter = "brightness(160%)";
                }
            } else {
                const currentCard = refCard.current;
                if (currentCard) {
                    currentCard.style.border = "1px solid #80c4cd";
                    currentCard.style.filter = "brightness(100%)";
                }
            }

            if (machine.connection === "CONECTED") {
                setPlayColor('#1f5948');
            } else {
                setPlayColor('#3C4557');
            }

            setMachineStatus({
                status: machine.connection,
                color: machine.connection === "CONECTED" ? 'rgb(23, 250, 137)' : 'rgba(248, 85, 85, 0.822)',
            });
        };
    }, [isLoading, elapsedTime]);

    const getCurrentClient = async () => {
        const currentSession = JSON.parse(localStorage.getItem("arena-adm-login"))

        console.log("machine CardMachine -> ", machine)

        if (machine.client_id) {
            try {

                await axios.get(`${import.meta.env.VITE_APP_API_URL}/client/find`, {
                    params: {
                        client_id: machine.client_id
                    },
                    headers: {
                        Authorization: `Bearer ${currentSession.token}`
                    }
                }).then(response => {
                    setCurrentClient(response.data.body)
                })

            } catch (error) {
                console.log(error.response)
            }
        }

    }

    function openPanelWarning() {
        console.log("observando id -> ", machine.nano_id)

        dispatch(machineToDelete({
            nano_id: machine.nano_id,
            machine_id: machine.id
        }))

        const PanelWarning = document.querySelector(".windows-del-warning")
        PanelWarning.style.display = 'flex'

    }

    const formatTime = (time) => {
        const formattedTime = dayjs().startOf("day").second(time).format("HH:mm:ss");
        return formattedTime;
    };

    const getBackgroundColor = () => {
        switch (machine.type) {
            case 'PC':
                return '#3C4557';  // Cor original
            case 'XBOX':
                return '#107C10';  // Verde do Xbox
            case 'PS5':
                return '#2E6DB4';  // Azul do PlayStation
            default:
                return '#3C4557';
        }
    }

    const handleStopMachine = async () => {
        const arenaAdmSession = JSON.parse(localStorage.getItem("arena-adm-login"))
        setIsLoading(true)

        let allSessions = []

        try {

            await axios.get(`${import.meta.env.VITE_APP_API_URL}/machines/find-machine`, {
                params: {
                    machine_id: machine.id
                },
                headers: {
                    'Authorization': `Bearer ${arenaAdmSession.token}`
                }
            }).then(response => {
                console.log("Machine found -> ", response.data)
                allSessions = response.data.sessions
            })

            await axios.post(`${import.meta.env.VITE_APP_API_URL}/machines/stop-machine`, {
                client_id: allSessions[allSessions.length - 1].client_id,
                machine_id: machine.id,
                elapsed_time: elapsedTime
            }, {
                headers: {
                    'Authorization': `Bearer ${arenaAdmSession.token}`
                }
            }).then(response => {
                console.log("machine stopped -> ", response.data)
                dispatch(machineRunning(response.data))
                setIsLoading(false)
                setElapsedTime(0)
            })

        } catch (error) {
            setIsLoading(false)
            console.log("Error at stop machine -> ", error.message)
        }

    }

    return (
        <div
            ref={refCard}
            style={{
                background: machine.status === "RUNNING" ? playColor : getBackgroundColor(),
                // ... outros estilos existentes
            }}
            className="
            shadow-lg shadow-[#141414af]
            min-w-[82px] min-h-[193px] 
            border-[1px] 
            border-[#80c4cd]
            hover:border-[#40b340]
            cursor-pointer 
            rounded-[10px] 
            flex 
            flex-col 
            justify-center
            relative 
            items-center">

            {showStoppedMessage && (
                <div className="absolute inset-0 flex items-center justify-center
                bg-black/70 backdrop-blur-sm rounded-[10px] z-10">
                    <div className="bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-lg
                    border border-yellow-500/30 text-sm font-medium animate-bounce">
                        Máquina Parada
                    </div>
                </div>
            )}

            <span className="absolute text-white top-1 right-1">
                {
                    machine.connection === 'CONECTED' ?
                        <Sync /> :
                        <span className="text-red-600"><SyncDisabled /></span>
                }

            </span>

            <div className="flex justify-center items-center w-[84px] h-[84px]">
                {
                    machine.type === "PC" &&
                    <img src={ComputerIcon} alt="" className="absolute" />
                }
                {
                    machine.type === "PS5" &&
                    <img src={PS_logo} alt="" className="absolute h-[37%] object-cover" style={{ filter: 'invert(1)' }} />
                }
                {
                    machine.type === "XBOX" &&
                    <img src={Xbox_logo} alt="" className="absolute h-[27%] object-cover" style={{ filter: 'invert(1)' }} />
                }
                <span className={`absolute font-bold text-[22px] 
                    font-[Sansation] text-white ${machine.type === "PC" ? "top-[1.2vh]" : "top-[3px] left-2"}`}>{machine.position}</span>
            </div>

            <span className="font-[18px] text-white">{machine.nano_id}</span>

            <span style={{ color: machineStatus.color }} className="font-[18px]">{machineStatus.status}</span>

            <div className="w-[150px] flex justify-center items-center gap-3">
                <img src={ClockIcon} alt="relógio ícone" />
                <span className="font-[18px] text-white">{formatTime(elapsedTime)}</span>
            </div>

            {
                machine.status !== "RUNNING" &&
                <img onClick={openPanelWarning} src={DeleteIcon} alt="delete icone"
                    className="mt-3 cursor-pointer hover:brightness-150" />
            }
            {
                machine.status === "RUNNING" ?
                    !isLoading ?
                        <div
                            onClick={() => handleStopMachine()}
                            className="flex justify-center items-center gap-1 p-1 mt-2 bg-white/25 hover:bg-white/70 rounded-md text-zinc-600">
                            <StopCircle className="h-[24px] w-[24px] text-red-600" />
                            <span className="font-[18px]">Parar</span>
                        </div> :
                        <span className="text-[#fea04d]">parando...</span> : ""

            }

            <span className="flex absolute top-1 right-1">
                {currentClient.avatar_url &&
                    <img src={currentClient.avatar_url} alt="" className="w-[30px] h-[30px] rounded-full object-cover" />
                }
            </span>
        </div>
    )
}

export default CardMachine;
