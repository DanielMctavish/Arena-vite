/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import ArenaLogoGold from "../../medias/logos/Logo_Completa_GOLD.png";
import BgAdm from '../../medias/bg-adm.png';

function PortalAdmLogin() {
    const navigate = useNavigate();
    const refEmail = useRef();
    const refPassword = useRef();
    const [serverStatus, setServerStatus] = useState('checking'); // 'online', 'offline', 'checking'
    const [borderClass, setBorderClass] = useState('border-[#e6a429]');
    const [logoFilter, setLogoFilter] = useState('');
    const [statusDotClass, setStatusDotClass] = useState("absolute w-[23px] h-[23px] bg-yellow-500 rounded-full left-1 top-1 z-20");

    useEffect(() => {
        checkServer();
        const intervalId = setInterval(checkServer, 2000);
        return () => clearInterval(intervalId);
    }, []);

    const checkServer = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_APP_API_URL}/check`);
            setServerStatus('online');
            setBorderClass('border-[#e6a429] transition-all duration-700');
            setLogoFilter('');
            setStatusDotClass("absolute w-[23px] h-[23px] font-bold bg-gradient-to-bl from-[#1aff00] via-[#4cff43] to-[#459a00] rounded-full left-1 top-1 z-20");
        } catch (err) {
            setServerStatus('offline');
            setBorderClass('border-red-600 transition-all duration-700');
            setLogoFilter('filter brightness-75 sepia saturate-200 hue-rotate-300 transition-all duration-700');
            setStatusDotClass("absolute w-[23px] h-[23px] bg-gradient-to-bl from-[red] via-[#ff4343] to-[#ca0000] rounded-full left-1 top-1 z-20");
        }
    };

    async function handleLoggOn() {
        if (!refEmail.current.value || !refPassword.current.value) {
            setServerStatus('error');
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/adm/login`, {
                email: refEmail.current.value,
                senha: refPassword.current.value
            });

            localStorage.setItem('arena-adm-login', JSON.stringify(response.data));
            navigate("/adm-machines");

        } catch (err) {
            if (err.response?.status === 404) {
                setServerStatus('user-not-found');
            } else if (err.response?.status === 401) {
                setServerStatus('wrong-password');
            } else if (err.response?.status === 500) {
                setServerStatus('server-error');
            } else {
                setServerStatus('offline');
            }
        }
    }

    const getStatusMessage = () => {
        switch (serverStatus) {
            case 'online':
                return "Servidor online! Bem-vindo!";
            case 'offline':
                return "FALHA AO CONECTAR COM O SERVIDOR";
            case 'checking':
                return "Verificando conexão com o servidor...";
            case 'error':
                return "Preencha todos os campos";
            case 'user-not-found':
                return "Usuário não existe";
            case 'wrong-password':
                return "Senha incorreta";
            case 'server-error':
                return "Erro nos servidores";
            default:
                return "Status desconhecido";
        }
    };

    const getStatusColor = () => {
        switch (serverStatus) {
            case 'online':
                return "text-green-400";
            case 'offline':
                return "text-red-500 animate-pulse";
            case 'checking':
                return "text-yellow-400";
            case 'error':
            case 'user-not-found':
            case 'wrong-password':
            case 'server-error':
                return "text-red-400";
            default:
                return "text-white";
        }
    };

    return (
        <div className={`bg-[#2F2F2F] w-full h-[100vh] flex flex-col justify-center items-center border-[10px] ${borderClass} text-white relative transition-all duration-700`}>
            <div className={statusDotClass} />
            
            <div 
                className={`absolute inset-0 bg-cover bg-center opacity-60 transition-all duration-700 ${
                    serverStatus === 'offline' ? 'bg-blend-color-burn' : ''
                }`}
                style={{
                    backgroundImage: `url(${BgAdm})`,
                }}
            />
            
            <div className={`absolute inset-0 bg-black transition-all duration-700 ${
                serverStatus === 'offline' ? 'opacity-80 bg-red-900/20' : 'opacity-70'
            }`} />

            <div className={`absolute top-6 z-10 text-center ${getStatusColor()} font-bold text-lg transition-all duration-700`}>
                {getStatusMessage()}
            </div>

            <section className="flex flex-col justify-between items-center h-[46vh] text-zinc-600 z-10">
                <img 
                    src={ArenaLogoGold} 
                    alt="logo arena dourado" 
                    className={`w-[286px] h-[191px] transition-all duration-700 ${logoFilter}`} 
                />

                <input 
                    ref={refEmail} 
                    type="text" 
                    placeholder="seu email" 
                    className="bg-[#FFFFFF] rounded-[4px] w-[200px] h-[36px] text-center" 
                    required 
                />
                <input 
                    ref={refPassword} 
                    type="password" 
                    placeholder="sua senha" 
                    className="bg-[#FFFFFF] rounded-[4px] w-[200px] h-[36px] text-center" 
                    required 
                />

                <button 
                    onClick={handleLoggOn} 
                    className={`bg-[#e6a429] border-[1px] border-[#ffce72] p-1 w-[200px] rounded-[4px] text-white 
                    ${serverStatus === 'offline' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#f4b23b] transition-colors'}`}
                    disabled={serverStatus === 'offline'}
                >
                    entrar
                </button>
            </section>
        </div>
    );
}

export default PortalAdmLogin;
