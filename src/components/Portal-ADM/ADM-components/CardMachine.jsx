import React, { useEffect, useState } from "react";
import ComputerIcon from "../../../medias/icons/iMac.png"
import ClockIcon from "../../../medias/icons/Wall Clock.png"
import DeleteIcon from "../../../medias/icons/Delete.png"
import { PlayArrow, PauseCircle } from "@mui/icons-material"
import dayjs from "dayjs";


function CardMachine(props) {
    const [elapsedTime, setElapsedTime] = useState(0);
    const [playColor, setPlayColor] = useState('#3C4557')
    const [machineStatus, setMachineStatus] = useState('')

    const statusProps = {
        status: 'inativa',
        color: 'rgb(113 113 122)'
    }
    useEffect(() => {

        let intervalId;
        return () => {
            setPlayColor('#3C4557')
            setMachineStatus(statusProps)
            clearInterval(intervalId);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



    function openPanelWarning() {
        const PanelWarning = document.querySelector(".windows-del-warning")
        PanelWarning.style.display = 'flex'
        console.log('observando id ->> ', props.machine_id, props.ID);
    }

    const formatTime = (time) => {
        const formattedTime = dayjs().startOf("day").second(time).format("HH:mm:ss");
        return formattedTime;
    };

    return (
        <div
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
            items-center">


            <span className="font-bold">teste:{props.ID}</span>

            <div className="flex justify-center items-center w-[84px] h-[84px]">
                <img src={ComputerIcon} alt="" className="absolute" />
                <span className="absolute font-bold text-[22px] font-[Sansation] text-white mt-[-20px]">{props.number}</span>
            </div>

            <span className="font-[18px] text-white">{props.ID}</span>

            <span style={{ color: machineStatus.color }} className="font-[18px]">{machineStatus.status}</span>

            <div className="w-[150px] flex justify-center items-center gap-3">
                <img src={ClockIcon} alt="relógio ícone" />
                <span className="font-[18px] text-white">{formatTime(elapsedTime)}</span>
            </div>


            <img onClick={openPanelWarning} src={DeleteIcon} alt="delete icone" className="mt-3 cursor-pointer hover:brightness-150" />

        </div>
    )
}

export default CardMachine;
