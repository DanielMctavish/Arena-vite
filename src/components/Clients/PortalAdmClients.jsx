/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import Asside from "../Portal-ADM/ADM-components/Asside";
import NavigationAdm from "../Portal-ADM/ADM-components/Navigation";
import ClienteLinhaTd from "./ClienteLinhaTd";
//import dayjs from "dayjs";
import CreateClient from "./CreateClient";
import { getAdmInfoByEmail } from "../Portal-ADM/functions/getAdmInfoByEmail";
import ModConnectClient from "./ModConnectClient";

function PortalAdmClientes() {
    const [clientList, setClientList] = useState([])
    const navigate = useNavigate();
    const refModAddCreate = useRef()

    const handleShowModAddCreate = () => {
        refModAddCreate.current.style.display = "flex"
    }
    useEffect(() => {
        getClientList()
    }, [])

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
            justify-center items-start gap-3 sm:w-[72%] 
            w-[94%] sm:max-h-[76vh] max-h-[77vh] sm:right-[3vh] 
            right-auto top-[16vh] p-3 overflow-y-auto'>
                <div className="flex w-[98%] h-[60px] bg-zinc-400 p-2 rounded-md">
                    <button
                        onClick={handleShowModAddCreate}
                        className="flex justify-center items-center bg-[#323e58] text-white p-3 rounded-md shadow-md shadow-[#14141431]">
                        Adicionar Cliente
                    </button>
                </div>

                <div className="flex flex-col text-zinc-900 w-[100%] p-6 gap-1">
                    {clientList.map((client, index) => (
                        <ClienteLinhaTd key={index} nome={client.nome} email={client.email} value={client.saldo} avatar_url={client.avatar_url} />
                    ))}
                </div>

            </section>

            <div ref={refModAddCreate} className="mod-add-client absolute hidden w-full h-[80vh] justify-center items-center">
                <CreateClient />
            </div>

            <div className="mod-connect-client absolute hidden w-full h-[80vh] justify-center items-center">
                <ModConnectClient />
            </div>

        </div>
    )
}

export default PortalAdmClientes;