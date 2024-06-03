import React, { useState } from "react";
import axios from "axios"
import ArenaLogo from "../../../medias/logos/Logo_Completa.png"
import rdr2_cover_desktop from "../../../medias/backgrounds/rdr2_cover_Desktop.png"
import { useNavigate } from "react-router-dom";

const PortalGamerLogin = () => {
    const [messageError, setMessageError] = useState('mensagem de erro')

    const navigate = useNavigate()

    const handleClientLogin = async () => {

        const email = document.querySelector(".client-login-email").value
        const password = document.querySelector(".client-login-password").value

        if (!email || !password) {
            document.querySelector(".error-display-login-client").style.display = 'flex'
            return setMessageError('preencha os campos')
        }
        document.querySelector(".error-display-login-client").style.display = 'none'

        try {

            await axios.post(`${import.meta.env.VITE_APP_API_URL}/client/login-client`, {
                email: email,
                senha: password
            }).then(async (response) => {

                console.log('resposta ao logar -> ', response.data)
                await localStorage.setItem('arena-client-login', JSON.stringify(response.data))
                navigate("/gamer-dashboard")

            })

        } catch (error) {
            console.log("erro ao tentar logar ", error)
        }
    }

    return (
        <div className="flex flex-col justify-center items-center bg-white w-full h-[100vh] overflow-hidden text-white font-trispace p-[10px]">

            <span className="absolute w-full h-[40px] hidden justify-center items-center top-0 bg-red-600 error-display-login-client z-40">{messageError}</span>
            <div className="absolute w-full h-full border-[10px] border-[#7100F3] z-30" />

            <img
                className="absolute w-full h-[100vh] object-cover"
                alt=""
                src={rdr2_cover_desktop}
            />

            <img
                className="absolute top-[58px]  w-[478px] h-[310px] object-cover z-50"
                alt=""
                src={ArenaLogo}
            />

            <div className="
            w-[478px] 
            h-[531px] 
            bg-gradient-to-b 
            from-[#7300F4] 
            to-[#32006A] 
            flex 
            flex-col 
            justify-around 
            items-center 
            z-40 
            rounded-[12px]">
                <div className="font-bold mt-6">
                    ENTRE NA SUA CONTA
                </div>

                <section className="flex flex-col justify-center items-center gap-3 z-30 p-2">
                    <input type="text" placeholder="seu email" className="p-1 text-[#6600DD] rounded-[4px] text-center client-login-email" />
                    <input type="password" placeholder="sua senha" className="p-1 text-[#6600DD] rounded-[4px] text-center client-login-password" />
                </section>

                <button
                    onClick={handleClientLogin}
                    className="bg-[#7100F3] border-[1px] border-[#902fff] p-1 w-[220px] rounded-[4px]">ENTRAR</button>
                <div
                    className="hover:cursor-pointer hover:font-bold"
                    onClick={() => { navigate('/gamer-register') }}>não tem uma conta? registre-se</div>
                <div className="text-[12px]">
                    esqueceu sua senha?
                </div>
            </div>
        </div>
    );
};

export default PortalGamerLogin;
