/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import ComputerIcon from "../../../medias/icons/iMac.png"
import ClockIcon from "../../../medias/icons/Wall Clock.png"
import DeleteIcon from "../../../medias/icons/Delete.png"
import { PlayArrow, PauseCircle, SyncDisabled, Sync } from "@mui/icons-material"
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { machineToDelete } from "../../../redux/machines/MachineSlice";


function CardMachine({ machine, socket, index }) {
    const [elapsedTime, setElapsedTime] = useState(0);
    const [playColor, setPlayColor] = useState('#3C4557')
    const [machineStatus, setMachineStatus] = useState('')

    const refCard = useRef()

    const dispatch = useDispatch()

    useEffect(() => {

        socket.on('session-machine-running', (message) => {
            //console.clear()
            if (message && machine.id === message.data.body.machine_id) {
                console.log('Message from server:', message);
                setElapsedTime(message.data.timer)
            }

        });

        return () => {
            if (machine.status === "RUNNING") {
                const currentCard = refCard.current;
                currentCard.style.border = "3px solid #00cccc";
                currentCard.style.filter = "brightness(160%)"; // Aumenta o brilho
            } else {
                const currentCard = refCard.current;
                currentCard.style.border = "none"; // Volta ao estilo normal
                currentCard.style.filter = "brightness(100%)"; // Volta ao brilho normal
            }

            if (machine.connection === "CONECTED") {
                setPlayColor('#1f5948')
            } else {
                setPlayColor('#3C4557')
            }

            setMachineStatus({
                status: machine.connection,
                color: machine.connection === "CONECTED" ? 'rgb(23, 250, 137)' : 'rgba(248, 85, 85, 0.822)'
            })
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => { }, [socket])



    function openPanelWarning() {

        dispatch(machineToDelete({
            nano_id: machine.ID,
            machine_id: machine.machine_id
        }))

        const PanelWarning = document.querySelector(".windows-del-warning")
        PanelWarning.style.display = 'flex'

    }

    const formatTime = (time) => {
        const formattedTime = dayjs().startOf("day").second(time).format("HH:mm:ss");
        return formattedTime;
    };

    return (
        <div
            ref={refCard}
            style={{ background: playColor }}
            className="
            w-[160px] h-[233px] 
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
                <img src={ComputerIcon} alt="" className="absolute" />
                <span className="absolute font-bold text-[22px] font-[Sansation] text-white mt-[-20px]">{index + 1}</span>
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
                    className="mt-3 cursor-pointer hover:brightness-150" />}

        </div>
    )
}

export default CardMachine;
