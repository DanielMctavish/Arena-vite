import React, { useState } from "react";
import axios from "axios"
import ArenaLogo from "../../../medias/logos/Logo_Completa.png"
import rdr2_cover_desktop from "../../../medias/backgrounds/rdr2_cover_Desktop.png"
import { useNavigate } from "react-router-dom";

const PortalGamerLogin = () => {
    const [messageError, setMessageError] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleClientLogin = async (e) => {
        e.preventDefault()
        if (!email || !password) {
            setMessageError('Preencha todos os campos')
            return
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/client/login-client`, {
                email: email,
                senha: password
            })

            await localStorage.setItem('arena-client-login', JSON.stringify(response.data))
            navigate("/gamer-dashboard")

        } catch (error) {
            console.error("Erro ao tentar logar:", error)
            setMessageError(error.response?.status === 403 ? 'Senha ou usuário incorretos' : 'Erro ao fazer login. Tente novamente.')
        }
    }

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-900 text-white font-trispace">
            <div className="md:flex-1 bg-cover bg-center h-48 md:h-auto relative" style={{ backgroundImage: `url(${rdr2_cover_desktop})` }}>
                <div className="absolute inset-0 backdrop-blur-sm bg-black bg-opacity-60"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <img src={ArenaLogo} alt="Arena JAF Logo" className="w-3/4 md:w-1/2 max-w-md object-contain" />
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center bg-gradient-to-br from-purple-900 to-indigo-900 p-4 md:p-8">
                <div className="w-full max-w-md">
                    <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Login do Gamer</h2>
                    {messageError && (
                        <div className="bg-red-500 text-white p-3 rounded mb-4 text-center text-sm md:text-base">
                            {messageError}
                        </div>
                    )}
                    <form onSubmit={handleClientLogin} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block mb-1 text-sm md:text-base">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:border-purple-500 focus:outline-none text-sm md:text-base"
                                placeholder="Seu email"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-1 text-sm md:text-base">Senha</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:border-purple-500 focus:outline-none text-sm md:text-base"
                                placeholder="Sua senha"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-300 text-sm md:text-base"
                        >
                            Entrar
                        </button>
                    </form>
                    <div className="mt-4 text-center text-sm md:text-base">
                        <p className="mb-2">
                            <span className="cursor-pointer hover:underline" onClick={() => navigate('/gamer-register')}>
                                Não tem uma conta? Registre-se
                            </span>
                        </p>
                        <p className="text-xs md:text-sm text-gray-400">Esqueceu sua senha?</p>
                    </div>
                    <div className="mt-8 text-center">
                        <button
                            onClick={() => navigate('/adm-login')}
                            className="text-xs md:text-sm text-gray-400 hover:text-white transition duration-300"
                        >
                            Área do Administrador
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PortalGamerLogin;
