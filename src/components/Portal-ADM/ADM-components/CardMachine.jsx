import React, { useEffect, useState } from "react";
import ComputerIcon from "../../../medias/icons/iMac.png"
import ClockIcon from "../../../medias/icons/Wall Clock.png"
import DeleteIcon from "../../../medias/icons/Delete.png"
import { PlayArrow, PauseCircle, SyncDisabled, Sync } from "@mui/icons-material"
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { machineToDelete } from "../../../redux/machines/MachineSlice";


function CardMachine(props) {
    const [elapsedTime, setElapsedTime] = useState(0);
    const [playColor, setPlayColor] = useState('#3C4557')
    const [machineStatus, setMachineStatus] = useState('')

    const dispatch = useDispatch()

    useEffect(() => {

        let intervalId;
        return () => {

            if (props.status === "CONECTED") {
                setPlayColor('#1f5948')
            } else {
                setPlayColor('#3C4557')
            }

            setMachineStatus({
                status: props.status,
                color: props.status === "CONECTED" ? 'rgb(23, 250, 137)' : 'rgba(248, 85, 85, 0.822)'
            })
            clearInterval(intervalId);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



    function openPanelWarning() {

        dispatch(machineToDelete({
            nano_id: props.ID,
            machine_id: props.machine_id
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
                    props.status === 'CONECTED' ?
                        <Sync /> :
                        <span className="text-red-600"><SyncDisabled /></span>
                }

            </span>

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


            <img onClick={openPanelWarning} src={DeleteIcon} alt="delete icone"
                className="mt-3 cursor-pointer hover:brightness-150" />

        </div>
    )
}

export default CardMachine;
