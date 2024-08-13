/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { selectedClient } from "../../redux/client/ClientSlice";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "@mui/icons-material"

function ClienteLinhaTd({ nome, email, value, avatar_url, client_id, isPlaying }) {
    const stateMachineRunning = useSelector(state => state.machine);
    const [machineSession, setMachineSession] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        getMachineSessionByClient();
    }, [client_id, stateMachineRunning]);

    const getMachineSessionByClient = () => {
        const currentAdmCookie = JSON.parse(localStorage.getItem('arena-adm-login'));
        if (!currentAdmCookie) return navigate("/");

        axios.get(`${import.meta.env.VITE_APP_API_URL}/adm/find-last-session?client_id=${client_id}`, {
            headers: {
                'Authorization': `Bearer ${currentAdmCookie.token}`
            }
        }).then(response => {
            console.log("cliente ID: ", response.data.id);
            setMachineSession(response.data);
        }).catch(error => {
            console.log('Erro ao tentar pegar a ultima sessão -> ', error.response);
        });
    };

    const handleShowConnectClient = () => {
        const ModConnectClient = document.querySelector(".mod-connect-client");
        ModConnectClient.style.display = "flex";

        dispatch(selectedClient({
            client_id: client_id,
            nome: nome,
            value: value,
            avatar_url: avatar_url
        }));
    };

    const handleShowConsumoClient = () => {
        const ModConnectClient = document.querySelector(".mod-consumo-client");
        ModConnectClient.style.display = "flex";

        dispatch(selectedClient({
            client_id: client_id,
            nome: nome,
            value: value,
            avatar_url: avatar_url
        }));
        
    };

    const handleShowAddSaldo = () => {
        const ModConnectClient = document.querySelector(".mod-add-saldo-client");
        ModConnectClient.style.display = "flex";

        dispatch(selectedClient({
            client_id: client_id,
            nome: nome,
            value: value,
            avatar_url: avatar_url
        }));
    };

    const formatTimer = (time) => {
        const minutes = parseInt(Math.floor(time / 60));
        const seconds = parseInt(time % 60);

        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');

        return `${formattedMinutes}:${formattedSeconds}`;
    };

    useEffect(() => {
        // console.log(`Machine session updated for client_id: ${client_id}`, machineSession.Machine && machineSession.Machine);
    }, [machineSession]);

    if (isPlaying) {
        return (
            <div className="flex flex-col relative mt-2">
                <span className="text-zinc-600 bg-white 
                flex justify-center items-center
                w-auto gap-3 h-[40px] rounded-t-md z-2 mb-[-3px]">
                    <span className="font-bold"> Em Sessão</span>
                </span>

                <div className="bg-[#43be4b] md:h-[8vh] border-[10px] border-white shadow-lg shadow-[#14141444]
                h-auto flex md:flex-row md:mt-0 mt-1 flex-col justify-center items-center p-1 rounded-md gap-6">

                    <div className="flex w-[40%] justify-between items-center gap-3">
                        <img src={avatar_url} alt="" className="w-[42px] h-[42px] rounded-full object-cover" />
                        <span className="font-bold text-white">{nome}</span>
                        <span className="font-bold">{machineSession.Machine && machineSession.Machine.nano_id}</span>
                    </div>

                    <span>
                        <button onClick={handleShowConsumoClient} className="flex bg-[#3C4557] p-2 rounded-[5px] text-white md:w-auto w-[180px] gap-3">
                            <span>consumo</span>
                            <ShoppingCart />
                        </button>
                    </span>

                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#D9D9D9] md:h-[8vh] h-auto flex md:flex-row md:mt-0 mt-1 flex-col justify-around items-center p-1 rounded-md">
            <section className="flex w-[400px] justify-start items-center gap-3 text-[14px]">
                <img src={avatar_url} alt="" className="w-[62px] h-[62px] rounded-full object-cover" />
                <span className="text-zinc-700 font-bold">{nome}</span>
                <span className="text-[#54678d]">{email}</span>
            </section>

            <section className="flex w-[360px] justify-between items-center text-[14px]">
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
    );
}

export default ClienteLinhaTd;
