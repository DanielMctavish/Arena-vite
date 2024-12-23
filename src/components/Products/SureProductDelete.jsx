/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";
import WarningIcon from "../../medias/icons/BoxImportant.png";
import { useNavigate } from "react-router-dom";

function SureProductDelete({ setIsLoading, isLoading, productId, productName, productUrl, reload }) {
    const [password, setPassword] = useState("");
    const [session, setSession] = useState();
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // "success" ou "error"
    const navigate = useNavigate();

    useEffect(() => {
        const getAdmSession = JSON.parse(localStorage.getItem("arena-adm-login"));
        if (!getAdmSession) {
            localStorage.removeItem("arena-adm-login");
            navigate("/adm-login");
        }
        setSession(getAdmSession);
    }, []);

    function CloseWindowWarning() {
        const currentWindow = document.querySelector(".windows-del-warning");
        if (currentWindow) {
            currentWindow.style.display = "none";
            // Limpar estados ao fechar
            setPassword("");
            setMessage("");
            setMessageType("");
        }
    }

    const handleDeleteProduct = async () => {
        if (!password) {
            setMessage("Por favor, digite sua senha");
            setMessageType("error");
            return;
        }

        setIsLoading(true);

        try {
            // Primeiro verifica a senha
            await axios.post(`${import.meta.env.VITE_APP_API_URL}/adm/login`, {
                email: session.email,
                senha: password
            });

            // Se a senha estiver correta, prossegue com a exclusão
            await axios.delete(`${import.meta.env.VITE_APP_API_URL}/product/delete-product?product_id=${productId}`, {
                headers: {
                    Authorization: `Bearer ${session.token}`
                }
            });

            // Exclui a imagem
            await axios.delete(`${import.meta.env.VITE_APP_API_URL}/product/delete-product-cover-img?url_image=${productUrl}`);
            
            setMessage("Produto excluído com sucesso!");
            setMessageType("success");
            setIsLoading(false);
            
            // Aguarda 1.5 segundos antes de fechar a janela e recarregar
            setTimeout(() => {
                CloseWindowWarning();
                reload();
            }, 1500);

        } catch (error) {
            setIsLoading(false);
            setPassword("");
            
            if (error.response?.status === 401) {
                setMessage("Senha incorreta");
            } else {
                setMessage("Erro ao excluir produto. Tente novamente.");
            }
            setMessageType("error");
        }
    };

    if (isLoading) {
        return (
            <div className="windows-del-warning 
                w-[636px] h-[337px] flex fixed
                flex-col justify-around 
                items-center bg-[#201733] 
                border-[1px] border-[#C8D3E9] 
                rounded-[10px] text-white z-[99]">
                <span className="text-[#ff9090]">excluindo produto... </span>
            </div>
        );
    }

    return (
        <div className="windows-del-warning 
            w-[636px] h-[337px] flex fixed
            flex-col justify-around 
            items-center bg-[#201733] 
            border-[1px] border-[#C8D3E9] 
            rounded-[10px] text-white z-[60]"
        >
            <img src={WarningIcon} alt="icon de aviso" />
            <span>VOCÊ TEM CERTEZA QUE DESEJA EXCLUIR O PRODUTO?</span>
            <span className="font-bold">{productName}</span>

            {message && (
                <div className={`text-sm ${
                    messageType === "success" ? "text-green-400" : "text-red-400"
                }`}>
                    {message}
                </div>
            )}

            <section className="flex gap-3">
                <input
                    type="password"
                    placeholder="confirme sua senha"
                    value={password}
                    className="text-zinc-700 text-center p-2 rounded-md"
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={messageType === "success"}
                />
                <button 
                    onClick={handleDeleteProduct} 
                    className="text-[#FF5454]"
                    disabled={messageType === "success"}
                >
                    DELETAR
                </button>
            </section>

            <button 
                onClick={CloseWindowWarning}
                className={messageType === "success" ? "text-green-400" : ""}
            >
                {messageType === "success" ? "FECHAR" : "CANCELAR"}
            </button>
        </div>
    );
}

export default SureProductDelete;