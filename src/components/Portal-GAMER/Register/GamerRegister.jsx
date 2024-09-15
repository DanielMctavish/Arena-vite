import React, { useState, useEffect } from "react"
import rdr2_cover_desktop from "../../../medias/backgrounds/rdr2_cover_Desktop.png"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Person, Email, Lock, Badge, ErrorOutline, LocationOn } from '@mui/icons-material';
import LoadingComp from "../../load/LoadingComp";

export default function GamerRegister() {
    const [messageError, setMessageError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [locations, setLocations] = useState([])
    const [selectedLocation, setSelectedLocation] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        getAllLocaltions()
    }, [])

    const getAllLocaltions = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/adm/all-locations`);
            console.log("todos os locais -> ", response.data)
            setLocations(response.data)
        } catch (error) {
            console.error("Erro ao buscar locais:", error);
            setMessageError('Erro ao carregar locais. Tente novamente.');
        }
    }

    const createAccount = async () => {
        const name = document.querySelector(".client-name").value
        const cpf = document.querySelector(".client-cpf").value
        const email = document.querySelector(".client-email").value
        const password = document.querySelector(".client-password").value
        const confirmPassword = document.querySelector(".client-confirm-password").value

        // Validations
        if (!name || name.split(" ")[0].length < 4 || name.split(" ").length < 2) {
            setMessageError('Necessário preencher nome e sobrenome válidos')
            return
        }
        if (!cpf || cpf.length < 11) {
            setMessageError('Necessário preencher um CPF válido')
            return
        }
        if (!email || email.length < 8) {
            setMessageError('Um email é fundamental, preencha com um email válido')
            return
        }
        if (password !== confirmPassword || !password) {
            setMessageError("As senhas precisam ser iguais")
            return
        }
        if (!selectedLocation) {
            setMessageError("Selecione um local")
            return
        }

        setMessageError('')
        setIsLoading(true)

        try {
            const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/client/create-client`, {
                email: email,
                administrator_id: selectedLocation,
                saldo: 0,
                nome: name,
                cpf: cpf,
                senha: password,
                avatar_url: ''
            });
            console.log('Cliente criado com sucesso! -> ', response.data);
            navigate('/gamer-login');
        } catch (err) {
            console.log(err.response);
            setMessageError('Erro ao criar conta. Tente novamente.');
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col justify-center items-center bg-white w-full h-[100vh] overflow-hidden text-white font-trispace p-[10px]">
            <div className="absolute w-full h-full border-[10px] border-[#7100F3] z-30" />

            <img
                className="absolute w-full h-[100vh] object-cover"
                alt=""
                src={rdr2_cover_desktop}
            />

            <div className="
            w-[478px] 
            h-[650px] 
            bg-gradient-to-b 
            from-[#7300F4] 
            to-[#32006A] 
            flex 
            flex-col 
            justify-around 
            items-center 
            z-40 
            rounded-[12px]
            shadow-lg">

                {messageError && (
                    <div className="flex items-center justify-center bg-red-600 p-2 rounded-t-[12px] w-full">
                        <ErrorOutline className="mr-2" />
                        <span>{messageError}</span>
                    </div>
                )}

                <div className="font-bold text-2xl mt-6">
                    REGISTRO GAMER
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center">
                        <LoadingComp />
                        <p className="mt-4">Cadastrando...</p>
                    </div>
                ) : (
                    <>
                        <section className="flex flex-col justify-start items-center gap-4 w-full px-8">
                            <div className="relative w-full">
                                <Person className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6600DD]" />
                                <input type="text" placeholder="Seu nome" 
                                className="p-2 pl-10 text-[#6600DD] rounded-[4px] 
                                w-full client-name z-[999] bg-white/90" />
                            </div>
                            <div className="relative w-full">
                                <Badge className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6600DD]" />
                                <input type="text" placeholder="Seu CPF" 
                                className="p-2 pl-10 text-[#6600DD] rounded-[4px] 
                                w-full client-cpf z-[999] bg-white/90" />
                            </div>
                            <div className="relative w-full">
                                <Email className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6600DD]" />
                                <input type="email" placeholder="Seu email" 
                                className="p-2 pl-10 text-[#6600DD] rounded-[4px] 
                                w-full client-email z-[999] bg-white/90" />
                            </div>
                            <div className="relative w-full">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6600DD]" />
                                <input type="password" placeholder="Sua senha" 
                                className="p-2 pl-10 text-[#6600DD] rounded-[4px] 
                                w-full client-password z-[999] bg-white/90" />
                            </div>
                            <div className="relative w-full">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6600DD]" />
                                <input type="password" placeholder="Confirme sua senha" 
                                className="p-2 pl-10 text-[#6600DD] rounded-[4px] 
                                w-full client-confirm-password z-[999] bg-white/90" />
                            </div>
                            <div className="relative w-full">
                                <LocationOn className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6600DD]" />
                                <select 
                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                    className="p-2 pl-10 text-[#6600DD] rounded-[4px] 
                                    w-full z-[999] bg-white/90"
                                >
                                    <option value="">Selecione um local</option>
                                    {locations.map((location) => (
                                        <option key={location.id} value={location.userAdmId}>
                                            {location.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </section>

                        <button
                            onClick={createAccount}
                            className="bg-[#7100F3] border-[1px] border-[#902fff] p-2 w-[220px] rounded-[4px] hover:bg-[#8f00ff] transition-colors">
                            Registrar
                        </button>
                        <div
                            className="hover:cursor-pointer hover:underline mb-6"
                            onClick={() => { navigate('/gamer-login') }}>
                            Já tem uma conta? Faça login
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}