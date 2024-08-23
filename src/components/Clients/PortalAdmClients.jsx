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

    return (
        <div className="bg-zinc-100 w-full h-[100vh] flex justify-center items-center border-[10px] border-[#e6a429]">
            <Asside />
            <NavigationAdm title="CLIENTES" />


            <section className='absolute flex flex-wrap 
            justify-center items-start gap-3 lg:w-[72%] 
            w-[90%] sm:max-h-[76vh] max-h-[77vh] sm:right-[3vh] 
            right-auto top-[16vh] p-3 overflow-y-auto'>
                <div className="flex w-[98%] h-[60px] bg-[#eaeaea] p-2 rounded-md justify-between items-center">
                    <button
                        onClick={handleShowModAddCreate}
                        className="flex justify-center items-center bg-[#323e58] text-white p-3 rounded-md shadow-md shadow-[#14141431]">
                        Adicionar Cliente
                    </button>
                    <div className="flex rounded-md overflow-hidden">
                        <input type="text" placeholder="pesquisar cliente"
                            className="bg-[#dfdfdf] text-[#353535] p-3" />
                        <div className="flex w-full bg-[#dfdfdf] justify-center items-center">
                            <Search sx={{fontSize:"33px"}}/>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col text-zinc-900 w-[100%] p-6 gap-1">
                    {clientList.map((client) => (
                        <ClienteLinhaTd
                            isPlaying={client.isPlaying}
                            key={client.id}
                            nome={client.nome}
                            email={client.email}
                            value={client.saldo}
                            avatar_url={client.avatar_url}
                            client_id={client.id}
                            horas={client.horas}
                        />
                    ))}
                </div>

            </section>

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
    )
}

export default PortalAdmClientes;