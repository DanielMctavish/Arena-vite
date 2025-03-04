import { Close, PointOfSale, AccessTime } from "@mui/icons-material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoadingComp from "../load/LoadingComp";

function ModAddSaldo({ changeState, setChangeState }) {
    const [tarifa, setTarifa] = useState(0);
    const [hours, setHours] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [method, setMethod] = useState("");
    const clientState = useSelector(state => state.client);

    const navigate = useNavigate("");

    const handleCloseCurrentWindow = () => {
        const currentClientWindow = document.querySelector(".mod-add-saldo-client");
        currentClientWindow.style.display = "none";
    };

    const handleAddHoursToClient = async () => {
        const getAdmSession = JSON.parse(localStorage.getItem("arena-adm-login"));
        if (!getAdmSession) return navigate("/");

        setIsLoading(true);
        if (hours <= 0 || tarifa <= 0 || !method) {
            setIsLoading(false);
            alert("Preencha todos os campos corretamente");
            return false;
        }

        try {
            const currentAdmin = await axios.get(`${import.meta.env.VITE_APP_API_URL}/adm/admin-info-email?email=${getAdmSession.email}`, {
                headers: {
                    'Authorization': `Bearer ${getAdmSession.token}`
                }
            });

            await axios.post(`${import.meta.env.VITE_APP_API_URL}/adm/add-hour`, {
                value: parseFloat(tarifa * hours),
                transaction_type: "MACHINE_CREDIT",
                fluxo: 'IN',
                method: method,
                status: "APPROVED",
                userAdmId: currentAdmin.data.id,
                userClientId: clientState.client_id
            }, {
                params: {
                    horas: hours
                },
                headers: {
                    'Authorization': `Bearer ${getAdmSession.token}`
                }
            }).then(() => {
                setChangeState(!changeState);
                setIsLoading(false);
                handleCloseCurrentWindow();
            });
        } catch (error) {
            setIsLoading(false);
            console.log("erro ao adicionar horas -> ", error.message);
        }
    };

    useEffect(() => {
        console.log("estado atual do cliente -> ", clientState);
    }, [clientState]);

    if (isLoading) {
        return (
            <div className="bg-[#18212f] p-6 rounded-lg shadow-xl border border-purple-500/20 
            flex flex-col items-center gap-4 min-w-[400px] max-w-lg mx-auto animate-fadeIn">
                <span className="text-white text-lg">Adicionando horas...</span>
                <LoadingComp />
            </div>
        );
    }

    return (
        <div className="bg-[#18212f] rounded-lg shadow-xl border border-purple-500/20 
        min-w-[400px] max-w-lg mx-auto overflow-hidden animate-fadeIn">
            {/* Header */}
            <div className="relative h-32 bg-gradient-to-r from-purple-600 to-blue-600 
            flex items-center justify-center p-4">
                <button 
                    onClick={handleCloseCurrentWindow}
                    className="absolute top-4 right-4 text-white/80 hover:text-white 
                    transition-colors p-1 hover:bg-white/10 rounded-full"
                >
                    <Close />
                </button>
                
                <div className="flex items-center gap-4">
                    <img 
                        src={clientState?.avatar_url} 
                        alt="" 
                        className="w-20 h-20 rounded-full object-cover border-4 border-[#18212f]" 
                    />
                    <div>
                        <h2 className="text-2xl font-bold text-white">
                            {clientState?.nome}
                        </h2>
                        <div className="bg-white/20 text-white text-sm px-3 py-1 rounded-full 
                        backdrop-blur-sm inline-block mt-1">
                            Adicionar Créditos
                        </div>
                    </div>
                </div>
            </div>

            {/* Formulário */}
            <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Tarifa (R$)</label>
                        <div className="relative">
                            <PointOfSale className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
                            <input 
                                type="number"
                                onChange={(e) => setTarifa(e.target.value)}
                                className="w-full bg-[#1f2937] border border-purple-500/20 rounded-lg
                                pl-10 pr-4 py-2.5 text-gray-300 focus:border-purple-500 transition-colors
                                outline-none"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Horas</label>
                        <div className="relative">
                            <AccessTime className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
                            <input 
                                type="number"
                                onChange={(e) => setHours(e.target.value)}
                                className="w-full bg-[#1f2937] border border-purple-500/20 rounded-lg
                                pl-10 pr-4 py-2.5 text-gray-300 focus:border-purple-500 transition-colors
                                outline-none"
                                placeholder="0"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-gray-400">Método de Pagamento</label>
                    <select 
                        onChange={(e) => setMethod(e.target.value)}
                        className="w-full bg-[#1f2937] border border-purple-500/20 rounded-lg
                        px-4 py-2.5 text-gray-300 focus:border-purple-500 transition-colors
                        outline-none appearance-none cursor-pointer"
                    >
                        <option value="">Selecione o método</option>
                        <option value="DINHEIRO">Dinheiro</option>
                        <option value="CREDITO">Cartão de Crédito</option>
                        <option value="PIX">PIX</option>
                    </select>
                </div>

                <button 
                    onClick={handleAddHoursToClient}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 
                    hover:from-purple-700 hover:to-blue-700 text-white font-medium
                    py-3 rounded-lg transition-all transform hover:scale-[1.02] 
                    active:scale-[0.98] shadow-lg hover:shadow-purple-500/25"
                >
                    Confirmar
                </button>
            </div>
        </div>
    );
}

export default ModAddSaldo;