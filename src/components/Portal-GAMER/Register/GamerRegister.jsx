import React, { useState } from "react"
import ArenaLogo from "../../../medias/logos/Logo_Completa.png"
import rdr2_cover_desktop from "../../../medias/backgrounds/rdr2_cover_Desktop.png"
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function GamerRegister() {
    const [messageError, setMessageError] = useState('mensagem de erro')

    const navigate = useNavigate()
    const createAccount = async () => {
        const name = document.querySelector(".client-name").value
        const cpf = document.querySelector(".client-cpf").value
        const email = document.querySelector(".client-email").value
        const password = document.querySelector(".client-password").value
        const confirmPassword = document.querySelector(".client-confirm-password").value

        //validations-------------------------------------------------------------------

        if (!name || name.split(" ")[0].length < 4 || name.split(" ").length < 2) {
            document.querySelector(".error-display").style.display = 'flex'
            return setMessageError('necessário preencher nome e sobrenome válidos')
        }
        if (!cpf || cpf.length < 11) {
            document.querySelector(".error-display").style.display = 'flex'
            return setMessageError('necessário preencher um cpf válido')
        }
        if (!email || email.length < 8) {
            document.querySelector(".error-display").style.display = 'flex'
            return setMessageError('um email é fundamental, preencha com um email válido')
        }
        if (password !== confirmPassword || !password) {
            document.querySelector(".error-display").style.display = 'flex'
            return setMessageError("as senhas precisam ser iguais")
        }

        document.querySelector(".error-display").style.display = 'none'
        console.log('todos os dados >>>', name, cpf, email, password, confirmPassword);

        await axios.post(`${process.env.REACT_APP_API_URL}/client/create-client`, {
            email: email,
            proprietario_id: 'abcdefg',
            saldo: 0,
            nome: name,
            cpf: cpf,
            senha: password,
            avatar_url: ''
        }).then(response => {

            console.log('cliente criado com sucesso! -> ', response.data);

        }).catch(err => { console.log(err.response); })

    }

    return (
        <div className="flex flex-col justify-center items-center bg-white w-full h-[100vh] overflow-hidden text-white font-trispace p-[10px]">
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

                <span className="absolute w-full h-[40px] hidden justify-center items-center top-0 bg-red-600 error-display">{messageError}</span>
                <div className="font-bold mt-12">
                    REGISTRO GAMER
                </div>

                <section className="flex flex-col justify-start items-center gap-2 z-30">
                    <input type="text" placeholder="seu nome" className="p-1 text-[#6600DD] rounded-[4px] text-center w-[220px] client-name" />
                    <input type="text" placeholder="seu cpf" className="p-1 text-[#6600DD] rounded-[4px] text-center w-[220px] client-cpf" />
                    <input type="text" placeholder="seu email" className="p-1 text-[#6600DD] rounded-[4px] text-center w-[220px] client-email" />
                    <input type="password" placeholder="sua senha" className="p-1 text-[#6600DD] rounded-[4px] text-center w-[220px] client-password" />
                    <input type="password" placeholder="confirme sua senha" className="p-1 text-[#6600DD] rounded-[4px] text-center w-[220px] client-confirm-password" />
                </section>

                <button
                    onClick={createAccount}
                    className="bg-[#7100F3] border-[1px] border-[#902fff] p-1 w-[220px] rounded-[4px]">registrar</button>
                <div
                    className="hover:cursor-pointer hover:font-bold"
                    onClick={() => { navigate('/gamer-login') }}>já tem uma conta?</div>
            </div>
        </div>
    )
}