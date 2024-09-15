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
            <div className="w-[60%] h-[88%] flex flex-col
        bg-gradient-to-t from-[#3C4557] to-[#192234]  text-white rounded-md 
        justify-center items-center gap-6 relative
        shadow-lg shadow-[#0f0f0f4d] overflow-y-auto">
                <span className="absolute top-[3vh]">adicionando horas...</span>
                <LoadingComp />
            </div>
        );
    }

    return (
        <div className="w-[60%] h-[88%] flex flex-col
        bg-gradient-to-t from-[#3C4557] to-[#192234]  text-white rounded-md 
        justify-center items-center gap-6 relative
        shadow-lg shadow-[#0f0f0f4d] overflow-y-auto">

            <span onClick={handleCloseCurrentWindow} className="absolute top-1 right-1 text-zinc-100 cursor-pointer">
                <Close />
            </span>

            <span className="text-[32px] font-bold">{clientState && clientState.nome}</span>
            <img src={clientState && clientState.avatar_url} alt="" className="w-[120px] h-[120px] object-cover rounded-full bg-zinc-300" />

            <div className="flex w-[80%] justify-center items-center gap-1">
                <div className="flex w-[50%] gap-1 justify-start items-center">
                    <PointOfSale />
                    <input onChange={(e) => { setTarifa(e.target.value) }}
                        type="text" className="p-2 border-[1px] bg-transparent rounded-md w-full"
                        placeholder="definir tarifa: R$ 0.00" />
                </div>
                <div className="flex w-[50%] gap-1 justify-start items-center">
                    <AccessTime />
                    <input onChange={(e) => { setHours(e.target.value) }}
                        type="text" className="p-2 border-[1px] bg-transparent rounded-md w-full"
                        placeholder="definir horas" />
                </div>
            </div>

            <select onChange={(e) => setMethod(e.target.value)} className="p-2 border-[1px] bg-transparent rounded-md w-[80%]">
                <option value="">Selecione o método de pagamento</option>
                <option value="CREDITO">Cartão de Crédito</option>
                <option value="PIX">PIX</option>
            </select>

            <button onClick={handleAddHoursToClient} className="p-2 bg-[#27314b] border-[1px] border-[#3e4e75] rounded-md w-[80%]">
                confirmar
            </button>

        </div>
    );
}

export default ModAddSaldo;