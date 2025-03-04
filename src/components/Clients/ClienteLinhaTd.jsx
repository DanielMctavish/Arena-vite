/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { selectedClient } from "../../redux/client/ClientSlice";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Timelapse, Storefront, Gamepad, ContactPage, AccessTime, Stop, Delete } from "@mui/icons-material";
import ClientDetailsModal from './ClientDetailsModal';

function ClienteLinhaTd({ nome, email, value, avatar_url, 
    client_id, isPlaying, horas, tel, address, cpf, created_at, onUpdate, sessions, transactions }) {
    const stateMachineRunning = useSelector(state => state.machine);
    const [machineSession, setMachineSession] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showDetails, setShowDetails] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        getMachineSessionByClient();
        console.log("sessões do cliente -> ", transactions);
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

    const handleForceStop = async () => {
        const currentAdmCookie = JSON.parse(localStorage.getItem('arena-adm-login'));
        if (!currentAdmCookie) return navigate("/");

        try {
            // Primeira chamada: Atualizar status do cliente
            await axios.patch(`${import.meta.env.VITE_APP_API_URL}/client/update?client_id=${client_id}`, 
                { isPlaying: false },
                {
                    headers: {
                        'Authorization': `Bearer ${currentAdmCookie.token}`
                    }
                }
            );

            // Segunda chamada: Parar a máquina
            if (machineSession.Machine) {
                await axios.post(`${import.meta.env.VITE_APP_API_URL}/machines/stop-machine`,
                    {
                        client_id: client_id,
                        machine_id: machineSession.Machine.id
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${currentAdmCookie.token}`
                        }
                    }
                );
            }

            // Atualizar o estado local
            getMachineSessionByClient();

            // Disparar atualização da lista de clientes
            dispatch({ type: 'UPDATE_CLIENTS_LIST' });

            // Chamar função de atualização passada como prop
            if (onUpdate) {
                onUpdate();
            }

        } catch (error) {
            console.error('Erro ao forçar parada:', error);
        }
    };

    const handleDelete = async () => {
        const currentAdmCookie = JSON.parse(localStorage.getItem('arena-adm-login'));
        if (!currentAdmCookie) return navigate("/");

        setIsDeleting(true);
        setShowDeleteConfirm(false);

        try {
            await axios.delete(`${import.meta.env.VITE_APP_API_URL}/adm/delete-client?client_id=${client_id}`, {
                headers: {
                    'Authorization': `Bearer ${currentAdmCookie.token}`
                }
            });

            // Atualizar a lista de clientes
            if (onUpdate) {
                onUpdate();
            }
        } catch (error) {
            console.error('Erro ao deletar cliente:', error);
            alert('Erro ao deletar cliente. Tente novamente.');
        } finally {
            setIsDeleting(false);
        }
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

    const handleClientUpdated = () => {
        // Chama a função de atualização passada pelo componente pai
        if (onUpdate) {
            onUpdate();
        }
    };

    // Modal de confirmação de delete
    const DeleteConfirmModal = () => (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-[#18212f] p-6 rounded-lg shadow-xl border border-red-500/20 
            max-w-md w-full mx-4">
                <h3 className="text-xl font-bold text-white mb-4">Confirmar Exclusão</h3>
                <p className="text-gray-300 mb-6">
                    Tem certeza que deseja excluir o cliente <span className="text-white font-semibold">{nome}</span>? 
                    Esta ação não pode ser desfeita.
                </p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 
                        text-white transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => {
                            handleDelete();
                            setShowDeleteConfirm(false);
                        }}
                        className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 
                        text-white transition-colors flex items-center gap-2"
                    >
                        <Delete />
                    </button>
                </div>
            </div>
        </div>
    );

    // Mini-modal de loading
    const DeletingModal = () => (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-[#18212f] p-6 rounded-lg shadow-xl border border-red-500/20 
            flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent" />
                <p className="text-white">Excluindo cliente...</p>
            </div>
        </div>
    );

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
                            <button
                                onClick={handleForceStop}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 
                                rounded-lg transition-colors flex items-center gap-2 shadow-lg"
                            >
                                <Stop />
                                <span className="lg:flex hidden">Forçar Parada</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-[#18212f] rounded-lg p-6 mt-4 hover:bg-[#1c2736] 
            transition-all duration-300 border border-purple-500/10 shadow-lg group">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                    {/* Informações do Cliente */}
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <img 
                                src={avatar_url} 
                                alt="" 
                                className="w-16 h-16 rounded-full object-cover border-2 border-purple-500/20 
                                group-hover:border-purple-500/40 transition-all" 
                            />
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 
                            border-[#18212f] bg-gray-500"></div>
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-lg group-hover:text-purple-400 
                            transition-colors">{nome}</h3>
                            <p className="text-gray-400 text-sm">{email}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-2 bg-purple-500/10 px-3 py-1 
                                rounded-full">
                                    <Timelapse className="text-purple-400 text-sm" />
                                    <span className="text-gray-300 text-sm font-medium">
                                        {horas && formatarHoras(horas)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ações */}
                    <div className="flex flex-wrap items-center gap-2 md:gap-3">
                        {/* Ações Principais */}
                        <div className="flex gap-2">
                            <button 
                                onClick={handleShowConnectClient}
                                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 
                                hover:to-green-800 text-white px-4 py-2 rounded-lg transition-all 
                                flex items-center gap-2 shadow-lg hover:shadow-green-500/20"
                            >
                                <Gamepad />
                                <span>Conectar</span>
                            </button>

                            <button 
                                onClick={handleShowAddSaldo}
                                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 
                                hover:to-blue-800 text-white px-4 py-2 rounded-lg transition-all 
                                flex items-center gap-2 shadow-lg hover:shadow-blue-500/20"
                            >
                                <AccessTime />
                                <span>Horas</span>
                            </button>
                        </div>

                        {/* Ações Secundárias */}
                        <div className="flex gap-2">
                            <button 
                                onClick={handleShowConsumoClient}
                                className="bg-purple-600/20 hover:bg-purple-600 text-purple-400 
                                hover:text-white p-2 rounded-lg transition-all flex items-center"
                                title="Loja"
                            >
                                <Storefront />
                            </button>

                            <button 
                                onClick={handleShowDetails}
                                className="bg-gray-600/20 hover:bg-gray-600 text-gray-400 
                                hover:text-white p-2 rounded-lg transition-all flex items-center"
                                title="Detalhes"
                            >
                                <ContactPage />
                            </button>

                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="bg-red-600/20 hover:bg-red-600 text-red-400 
                                hover:text-white p-2 rounded-lg transition-all flex items-center"
                                title="Excluir Cliente"
                            >
                                <Delete />
                            </button>
                        </div>
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
                        created_at,
                        Sessions: sessions,
                        Transactions: transactions
                    }}
                    onClose={() => setShowDetails(false)}
                    onClientUpdated={handleClientUpdated}
                />
            )}

            {showDeleteConfirm && <DeleteConfirmModal />}
            {isDeleting && <DeletingModal />}
        </>
    );
}

export default ClienteLinhaTd;
