/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import Asside from "../Asside/Asside";
import NavigationAdm from "../navigation/Navigation";
import ClienteLinhaTd from "./ClienteLinhaTd";
//import dayjs from "dayjs";
import CreateClient from "./CreateClient";
import { getAdmInfoByEmail } from "../Portal-ADM/functions/getAdmInfoByEmail";
import ModConnectClient from "./ModConnectClient";
import ModClientConsumo from "./ModClientConsumo";
import ModAddSaldo from "./ModAddSaldo";
import { useSelector } from "react-redux";
import { Search } from "@mui/icons-material"


function PortalAdmClientes() {
    const stateMachineRunning = useSelector(state => state.machine)
    const [clientList, setClientList] = useState([])
    const [filteredClients, setFilteredClients] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [changeState, setChangeState] = useState(false)
    const navigate = useNavigate();
    const refModAddCreate = useRef()

    useEffect(() => {
        getClientList()
        console.log("redux: ", stateMachineRunning)
    }, [changeState, stateMachineRunning])

    const handleShowModAddCreate = () => {
        refModAddCreate.current.style.display = "flex"
    }

    const getClientList = async () => {
        const getAdmSession = JSON.parse(localStorage.getItem("arena-adm-login"))
        if (!getAdmSession) return navigate("/")
        const authorizationConfig = {
            headers: {
                'Authorization': `Bearer ${getAdmSession.token}`
            }
        };
        try {
            getAdmInfoByEmail(getAdmSession.email).then(async res => {
                await axios.get(`${import.meta.env.VITE_APP_API_URL}/client/list?administrator_id=${res.id}`, authorizationConfig)
                    .then(response => {
                        setClientList(response.data.body)
                    })
            })
        } catch (error) {
            console.log('erro ao pegar clientList ->', error.message);
        }
    }

    const handleSearch = (value) => {
        setSearchTerm(value);
        
        if (value.length >= 3) {
            const filtered = clientList.filter(client => 
                client.nome.toLowerCase().includes(value.toLowerCase()) ||
                client.email.toLowerCase().includes(value.toLowerCase()) ||
                client.cpf.includes(value)
            );
            setFilteredClients(filtered);
        } else {
            setFilteredClients(clientList);
        }
    };

    useEffect(() => {
        setFilteredClients(clientList);
    }, [clientList]);

    return (
        <div className="bg-zinc-800 w-full h-[100vh] 
        flex justify-center items-center border-[10px] 
        border-[#e6a429] relative overflow-hidden">
            <nav className="w-[30%] h-[100vh] relative">
                <Asside />
            </nav>

            <section className="w-[70%] h-[100vh] relative p-3">
                <NavigationAdm title="CLIENTES" />

                <div className="absolute flex flex-col w-full max-h-[78vh] top-[16vh] p-1 
                overflow-y-auto scrollbar scrollbar-thumb-[#18212f] scrollbar-track-gray-100">
                    {/* Barra de Pesquisa e Botão Adicionar */}
                    <div className="flex w-[98%] h-[60px] bg-zinc-800/50 backdrop-blur-[12px] p-4 rounded-lg mb-4 justify-between items-center">
                        <button
                            onClick={handleShowModAddCreate}
                            className="flex justify-center items-center bg-[#323e58] text-white p-3 rounded-md shadow-md shadow-[#14141431]"
                        >
                            Adicionar Cliente
                        </button>
                        <div className="flex rounded-md overflow-hidden relative">
                            <input 
                                type="text" 
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Pesquisar por nome, email ou CPF"
                                className="w-[300px] bg-[#dfdfdf] text-[#353535] p-3 pr-12" 
                            />
                            <div className="absolute right-0 top-0 bottom-0 flex items-center justify-center px-3 bg-[#dfdfdf]">
                                <Search sx={{fontSize:"24px", color: searchTerm.length >= 3 ? "#4a5670" : "#999"}}/>
                            </div>
                        </div>
                    </div>

                    {/* Lista de Clientes */}
                    <div className="flex flex-col text-zinc-900 w-[100%] p-6 gap-1">
                        {/* Mensagem quando não encontrar resultados */}
                        {searchTerm.length >= 3 && filteredClients.length === 0 && (
                            <div className="text-center text-gray-400 py-4">
                                Nenhum cliente encontrado para "{searchTerm}"
                            </div>
                        )}

                        {/* Lista de clientes filtrada */}
                        {(searchTerm.length >= 3 ? filteredClients : clientList).map((client) => (
                            <ClienteLinhaTd
                                key={client.id}
                                isPlaying={client.isPlaying}
                                nome={client.nome}
                                email={client.email}
                                value={client.saldo}
                                avatar_url={client.avatar_url}
                                client_id={client.id}
                                horas={client.horas}
                                tel={client.tel}
                                address={client.address}
                                cpf={client.cpf}
                                created_at={client.created_at}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Modais */}
            <div ref={refModAddCreate} className="mod-add-client absolute hidden w-full h-[80vh] justify-center items-center">
                <CreateClient />
            </div>

            <div className="mod-connect-client absolute hidden w-full h-[80vh] justify-center items-center">
                <ModConnectClient />
            </div>

            <div className="mod-consumo-client absolute hidden w-full h-[80vh] justify-center items-center">
                <ModClientConsumo />
            </div>

            <div className="mod-add-saldo-client absolute hidden w-full h-[80vh] justify-center items-center">
                <ModAddSaldo changeState={changeState} setChangeState={setChangeState} />
            </div>
        </div>
    );
}

export default PortalAdmClientes;