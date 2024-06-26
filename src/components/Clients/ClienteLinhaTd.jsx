/* eslint-disable react-hooks/exhaustive-deps */
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { selectedClient } from "../../redux/client/ClientSlice";
import { useNavigate } from "react-router-dom";
import { connectWebSocket } from "../SocketCOM/connectWebSocket";

function ClienteLinhaTd({ nome, email, value, avatar_url, client_id, isPlaying }) {
    const [socket, setSocket] = useState()
    const [machineSession, setMachineSession] = useState({})
    const [elapsedTime, setElapsedTime] = useState()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {

        getMachineSessionByClient()

        console.log("cliente is playing? -> ", isPlaying)

        if (isPlaying) {
            const currentSocket = connectWebSocket()
            setSocket(currentSocket);
            currentSocket.on('session-machine-running', (message) => {
                //console.clear()
                if (message && machineSession.machine_id === message.data.body.machine_id) {
                    //console.log('Message from server:', message);
                    setElapsedTime(message.data.timer)
                }

            });
        }

    }, [])

    useEffect(() => { }, [elapsedTime,socket])

    const getMachineSessionByClient = async () => {
        const currentAdmCookie = JSON.parse(localStorage.getItem('arena-adm-login'))
        if (!currentAdmCookie) return navigate("/")

        await axios.get(`${import.meta.env.VITE_APP_API_URL}/adm/find-session?client_id=${client_id}`, {
            headers: {
                'Authorization': `Bearer ${currentAdmCookie.token}`
            }
        }).then(response => {
            setMachineSession(response.data)
        })

    }

    const handleShowConnectClient = () => {
        const ModConnectClient = document.querySelector(".mod-connect-client")
        ModConnectClient.style.display = "flex";

        dispatch(selectedClient({
            client_id: client_id,
            nome: nome,
            value: value,
            avatar_url: avatar_url
        }))
    }

    const handleShowConsumoClient = () => {
        const ModConnectClient = document.querySelector(".mod-consumo-client")
        ModConnectClient.style.display = "flex";
    }

    const handleShowAddSaldo = () => {
        const ModConnectClient = document.querySelector(".mod-add-saldo-client")
        ModConnectClient.style.display = "flex";

        dispatch(selectedClient({
            client_id: client_id,
            nome: nome,
            value: value,
            avatar_url: avatar_url
        }))
    }

    const formatTime = (time) => {
        const formattedTime = dayjs().startOf("day").second(time).format("HH:mm:ss");
        return formattedTime;
    };

    return (
        <div className="bg-[#D9D9D9] md:h-[8vh] h-auto flex md:flex-row md:mt-0 mt-1 flex-col justify-around items-center p-1 rounded-md">

            {isPlaying &&
                <span className="font-bold text-[#f54242] flex justify-center items-center gap-3  w-[80px] h-full bg-white rounded-md">
                    <span>{elapsedTime}</span>
                </span>
            }

            <section className="flex w-[400px] justify-start items-center gap-3 text-[14px]">
                <img src={avatar_url} alt="" className="w-[62px] h-[62px] rounded-full object-cover" />
                <span className="text-zinc-700 font-bold">{nome}</span>
                <span className="text-[#54678d]">{email}</span>
            </section>

            <section className="flex w-[360px] justify-between items- text-[14px]">
                <span>
                    <button onClick={handleShowConnectClient} className="bg-[#31B255] p-2 rounded-[5px] text-white md:w-auto w-[180px]">
                        conectar
                    </button>
                </span>
                <span>
                    <button onClick={handleShowConsumoClient} className="bg-[#3C4557] p-2 rounded-[5px] text-white md:w-auto w-[180px]">
                        consumo
                    </button>
                </span>
                <span>
                    <button onClick={handleShowAddSaldo} className="bg-[#3C4557] p-2 rounded-[5px] text-white md:w-auto w-[180px]">
                        add saldo
                    </button>
                </span>
                <span>
                    <button className="bg-[#3C4557] p-2 rounded-[5px] text-white md:w-auto w-[180px]">
                        detalhes
                    </button>
                </span>
            </section>

            <span className="flex font-bold w-[100px] text-[14px]">R$ {value.toFixed(2)}</span>
        </div>
    )
}

export default ClienteLinhaTd;