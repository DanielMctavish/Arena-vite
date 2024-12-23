/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { selectedClient } from "../../redux/client/ClientSlice";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Timelapse, Storefront, Gamepad, ContactPage, AccessTime } from "@mui/icons-material";
import ClientDetailsModal from './ClientDetailsModal';

function ClienteLinhaTd({ nome, email, value, avatar_url, client_id, isPlaying, horas, tel, address, cpf, created_at }) {
    const stateMachineRunning = useSelector(state => state.machine);
    const [machineSession, setMachineSession] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        getMachineSessionByClient();
        console.log("horas do cliente -> ", horas);
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

    const handleShowDetails = () => {
        setShowDetails(true);
    };

    useEffect(() => {
        // console.log(`Machine session updated for client_id: ${client_id}`, machineSession.Machine && machineSession.Machine);
    }, [machineSession]);

    function formatarHoras(horas) {
        if (!horas) return '0h 0min';

        const horasInteiras = Math.floor(horas); // Parte inteira das horas
        const minutos = Math.round((horas - horasInteiras) * 60); // Converte a parte decimal para minutos

        return `${horasInteiras}h ${minutos}min`;
    }

    if (isPlaying) {
        return (
            <div className="flex flex-col relative mt-4">
                <div className="absolute -top-3 left-4 bg-green-500 text-white px-4 py-1 
                rounded-full text-sm font-semibold shadow-lg z-10 flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    Em Sessão
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg 
                shadow-lg p-6 border border-green-400/20">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <img src={avatar_url} alt="" 
                                className="w-12 h-12 rounded-full object-cover border-2 border-white/50" 
                            />
                            <div>
                                <h3 className="text-white font-bold text-lg">{nome}</h3>
                                <p className="text-green-100">
                                    Máquina: {machineSession.Machine && machineSession.Machine.nano_id}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={handleShowConsumoClient} 
                                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 
                                rounded-lg transition-colors flex items-center gap-2 backdrop-blur-sm">
                                <ShoppingCart />
                                <span>Loja</span>
                            </button>
                            <button onClick={handleShowAddSaldo}
                                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 
                                rounded-lg transition-colors flex items-center gap-2 backdrop-blur-sm">
                                <AccessTime />
                                <span className="lg:flex hidden">Adicionar Horas</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#18212f] rounded-lg p-6 mt-4 hover:bg-[#1c2736] 
        transition-all duration-300 border border-purple-500/10 shadow-lg">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <img src={avatar_url} alt="" 
                        className="w-12 h-12 rounded-full object-cover border-2 border-purple-500/20" 
                    />
                    <div>
                        <h3 className="text-white font-bold text-lg">{nome}</h3>
                        <p className="text-gray-400 text-sm">{email}</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="bg-purple-500/10 px-4 py-2 rounded-lg flex items-center gap-2">
                        <Timelapse className="text-purple-400" />
                        <span className="text-white font-medium">
                            {horas && formatarHoras(horas)}
                        </span>
                    </div>

                    <div className="flex gap-2">
                        <button onClick={handleShowConnectClient} 
                            className="bg-green-600 hover:bg-green-700 text-white p-2 
                            rounded-lg transition-colors flex items-center gap-2">
                            <Gamepad />
                            <span className="lg:flex hidden">Conectar</span>
                        </button>
                        
                        <button onClick={handleShowConsumoClient}
                            className="bg-purple-600 hover:bg-purple-700 text-white p-2 
                            rounded-lg transition-colors flex items-center gap-2">
                            <Storefront />
                            <span className="lg:flex hidden">Loja</span>
                        </button>
                        
                        <button onClick={handleShowAddSaldo}
                            className="bg-blue-600 hover:bg-blue-700 text-white p-2 
                            rounded-lg transition-colors flex items-center gap-2">
                            <AccessTime />
                            <span className="lg:flex hidden">Adicionar Horas</span>
                        </button>
                        
                        <button onClick={handleShowDetails}
                            className="bg-gray-600 hover:bg-gray-700 text-white p-2 
                            rounded-lg transition-colors flex items-center gap-2">
                            <ContactPage />
                            <span className="lg:flex hidden">Detalhes</span>
                        </button>
                    </div>
                </div>
            </div>

            {showDetails && (
                <ClientDetailsModal 
                    client={{
                        nome,
                        email,
                        saldo: value,
                        avatar_url,
                        id: client_id,
                        isPlaying,
                        horas,
                        tel,
                        address,
                        cpf,
                        created_at
                    }}
                    onClose={() => setShowDetails(false)}
                />
            )}
        </div>
    );
}

export default ClienteLinhaTd;
