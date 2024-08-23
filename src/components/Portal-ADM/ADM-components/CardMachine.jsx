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
    const [isLoading, setIsLoading] = useState(false)
    const [elapsedTime, setElapsedTime] = useState(0);
    const [playColor, setPlayColor] = useState('#3C4557')
    const [machineStatus, setMachineStatus] = useState('')

    const refCard = useRef()
    const dispatch = useDispatch()

    const socketClient = new connectWebSocketClient()

    useEffect(() => {
        const socket = socketClient.getSocketInstance();

        socket.on(`${machine.id}-running`, (message) => {
            // console.log("rodando... ", message.data.body.client_id);
            setElapsedTime(message.data.cronTimer);
        });

        // Função de limpeza
        return () => {
            socket.off(`${machine.id}-running`); // Desativa o listener do evento

            if (machine.status === "RUNNING") {
                const currentCard = refCard.current;
                if (currentCard) {
                    currentCard.style.border = "3px solid #00cccc";
                    currentCard.style.filter = "brightness(160%)"; // Aumenta o brilho
                }
            } else {
                const currentCard = refCard.current;
                if (currentCard) {
                    currentCard.style.border = "none"; // Volta ao estilo normal
                    currentCard.style.filter = "brightness(100%)"; // Volta ao brilho normal
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, elapsedTime]);



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
            style={{ background: playColor }}
            className="
            shadow-lg shadow-[#141414af]
            min-w-[160px] min-h-[233px] 
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
                    font-[Sansation] text-white ${machine.type === "PC" ? "top-[34px]" : "top-[3px] left-2"}`}>{index + 1}</span>
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

        </div>
    )
}

export default CardMachine;
