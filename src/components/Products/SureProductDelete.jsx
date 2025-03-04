/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";
import WarningIcon from "../../medias/icons/BoxImportant.png";
import { useNavigate } from "react-router-dom";

function SureProductDelete({ setIsLoading, isLoading, productId, productName, productUrl, reload, onClose }) {
    const [password, setPassword] = useState("");
    const [session, setSession] = useState();
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const getAdmSession = JSON.parse(localStorage.getItem("arena-adm-login"));
        if (!getAdmSession) {
            localStorage.removeItem("arena-adm-login");
            navigate("/adm-login");
        }
        setSession(getAdmSession);
    }, []);

    const handleClose = () => {
        setPassword("");
        setMessage("");
        setMessageType("");
        onClose();
    };

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
            
            // Aguarda 1.5 segundos antes de fechar e recarregar
            setTimeout(() => {
                handleClose();
                reload();
            }, 1500);

        } catch (error) {
            setPassword("");
            
            if (error.response?.status === 401) {
                setMessage("Senha incorreta");
            } else {
                setMessage("Erro ao excluir produto. Tente novamente.");
            }
            setMessageType("error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-[#201733] rounded-xl border border-purple-500/20 p-8 
        max-w-md w-full mx-4 animate-fadeIn">
            <div className="flex flex-col items-center gap-6">
                <img src={WarningIcon} alt="Ícone de aviso" className="w-16 h-16" />
                
                <div className="text-center">
                    <h3 className="text-white text-lg font-bold mb-2">
                        CONFIRMAR EXCLUSÃO
                    </h3>
                    <p className="text-gray-300">
                        Você tem certeza que deseja excluir o produto:
                    </p>
                    <p className="text-white font-bold mt-1">{productName}</p>
                </div>

                {message && (
                    <div className={`text-sm ${
                        messageType === "success" ? "text-green-400" : "text-red-400"
                    }`}>
                        {message}
                    </div>
                )}

                <div className="flex flex-col w-full gap-4">
                    <input
                        type="password"
                        placeholder="Confirme sua senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={messageType === "success"}
                        className="w-full bg-[#2c3e50] text-white px-4 py-2 rounded-lg
                        border border-purple-500/20 focus:border-purple-500 transition-colors
                        outline-none text-center"
                    />

                    <div className="flex gap-3 justify-center">
                        <button 
                            onClick={handleClose}
                            className="px-6 py-2 rounded-lg bg-gray-600 text-white
                            hover:bg-gray-700 transition-colors"
                        >
                            {messageType === "success" ? "FECHAR" : "CANCELAR"}
                        </button>

                        {messageType !== "success" && (
                            <button 
                                onClick={handleDeleteProduct}
                                className="px-6 py-2 rounded-lg bg-red-600 text-white
                                hover:bg-red-700 transition-colors"
                                disabled={isLoading}
                            >
                                {isLoading ? "EXCLUINDO..." : "EXCLUIR"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SureProductDelete;