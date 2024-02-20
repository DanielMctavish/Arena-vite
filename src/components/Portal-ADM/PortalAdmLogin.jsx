/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from "react";
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import ArenaLogoGold from "../../medias/logos/Logo_Completa_GOLD.png";
//import dayjs from "dayjs";


function PortalAdmLogin() {
    const navigate = useNavigate();
    const refEmail = useRef()
    const refPassword = useRef()
    const refSpanMessage = useRef()

    useEffect(() => {

        const getAdmSession = localStorage.getItem('arena-adm-login')
        if (getAdmSession) {
            navigate("/adm-sessions")
        }

    }, [])


    async function handleLoggOn() {
        if (!refEmail.current.value || !refPassword.current.value) {
            refSpanMessage.current.innerHTML = "Preencha todos os campos"
        } else {
            await axios.post(`${import.meta.env.VITE_APP_API_URL}/adm/login`, {
                email: refEmail.current.value,
                senha: refPassword.current.value
            }).then(async response => {

                console.log('resposta ao logar -> ', response.data)
                await localStorage.setItem('arena-adm-login', JSON.stringify(response.data))
                navigate("/adm-sessions")

            }).catch(err => {
                console.log('erro ao tentar logar: ', err.response)
                if (err.response.status === 404) {
                    refSpanMessage.current.innerHTML = "Usuário não existe"
                }

                if (err.response.status === 401) {
                    refSpanMessage.current.innerHTML = "Senha incorreta"
                }

                if (err.response.status === 500) {
                    refSpanMessage.current.innerHTML = "Erro nos servidores"
                }
            })
        }
    }

    const handleNavigateRegisterMaster = () => {
        navigate("/register-master")
    }


    return (
        <div className="bg-[#2F2F2F] w-full h-[100vh] flex flex-col justify-center items-center border-[10px] border-[#e6a429] text-white">
            <span ref={refSpanMessage} className="absolute top-6">apenas administradores e colaboradores podem acessar esta área</span>

            <section className="flex flex-col justify-between items-center h-[46vh] text-zinc-600">
                <img onClick={handleNavigateRegisterMaster} src={ArenaLogoGold} alt="logo arena dourado" className="w-[286px] h-[191px]" />

                <input ref={refEmail} type="text" placeholder="seu email" className="bg-[#FFFFFF] rounded-[4px] w-[200px] h-[36px] text-center" required />
                <input ref={refPassword} type="password" placeholder="sua senha" className="bg-[#FFFFFF] rounded-[4px] w-[200px] h-[36px] text-center" required />

                <button onClick={handleLoggOn} className="bg-[#e6a429] border-[1px] border-[#ffce72] p-1 w-[200px] rounded-[4px] text-white">entrar</button>
            </section>
        </div>
    );
}

export default PortalAdmLogin;
