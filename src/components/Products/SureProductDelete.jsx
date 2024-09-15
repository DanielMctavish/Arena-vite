/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";
import WarningIcon from "../../medias/icons/BoxImportant.png";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function SureProductDelete({ setIsLoading, isLoading, productId, productName, productUrl, reload }) {
    const [password, setPassword] = useState("");
    const [session, setSession] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        const getAdmSession = JSON.parse(localStorage.getItem("arena-adm-login"));
        if (!getAdmSession) {
            localStorage.removeItem("arena-adm-login");
            navigate("/adm-login");
        }
        setSession(getAdmSession);
    }, [password]);

    function CloseWindowWarning() {
        const currentWindow = document.querySelector(".windows-del-warning");
        if (currentWindow) {
            currentWindow.style.display = "none";
        }
    }

    const handleDeleteProduct = async () => {
        setIsLoading(true);

        try {
            await axios.post(`${import.meta.env.VITE_APP_API_URL}/adm/login`, {
                email: session.email,
                senha: password
            });

            await axios.delete(`${import.meta.env.VITE_APP_API_URL}/product/delete-product?product_id=${productId}`, {
                headers: {
                    Authorization: `Bearer ${session.token}`
                }
            }).then(async () => {
                await axios.delete(`${import.meta.env.VITE_APP_API_URL}/product/delete-product-cover-img?url_image=${productUrl}`);
                setIsLoading(false);
                reload();
            });

            CloseWindowWarning();
        } catch (error) {
            setPassword("");
            setIsLoading(false);
            console.log('erro ao tentar excluir produto -> ', error.response);
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
        <div
            className="windows-del-warning 
                    w-[636px] h-[337px] flex fixed
                    flex-col justify-around 
                    items-center bg-[#201733] 
                    border-[1px] border-[#C8D3E9] 
                    rounded-[10px] text-white z-[60]"
        >
            <img src={WarningIcon} alt="icon de aviso" />
            <span>VOCÊ TEM CERTEZA QUE DESEJA EXCLUIR O PRODUTO?</span>
            <span className="font-bold">{productName}</span> {/* Exibir o nome do produto */}

            <section className="flex gap-3">
                <input
                    type="password"
                    placeholder="confirme sua senha"
                    className="text-zinc-700 text-center p-2 rounded-md"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleDeleteProduct} className="text-[#FF5454]">DELETAR</button>
            </section>

            <button onClick={CloseWindowWarning}>CANCELAR</button>
        </div>
    );
}

export default SureProductDelete;