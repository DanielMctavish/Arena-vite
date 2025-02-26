/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import Asside from "../Asside/Asside";
import NavigationAdm from "../navigation/Navigation";
import CardLocal from "../Portal-ADM/ADM-components/CardLocal";
import { Add } from '@mui/icons-material'
import AddNewLocation from "../Portal-ADM/ADM-Modais/AddNewLocation";
//import dayjs from "dayjs";

function PortalAdmLocais(props) {
    const [localList, setLocalList] = useState([])

    const navigate = useNavigate();

    function OpenPainelLocation() {
        const currentPainel = document.querySelector(".painel-local")
        currentPainel.style.display = 'flex';
    }

    const getAllLocaltions = async () => {
        const getAdmSession = JSON.parse(localStorage.getItem("arena-adm-login"))
        if (!getAdmSession) return navigate("/")

        await axios.get(`${import.meta.env.VITE_APP_API_URL}/adm/all-locations`, {
            headers: {
                'Authorization': `Bearer ${getAdmSession.token}`
            }
        }).then(response => {
            console.log("todos os locais -> ", response.data)
            setLocalList(response.data)
        })
    }

    useEffect(() => {
        getAllLocaltions()
    }, [])

    return (
        <div className="bg-zinc-800 w-full h-[100vh] flex justify-center items-center 
        border-[10px] border-[#e6a429] relative overflow-hidden">
            <nav className="w-[30%] h-[100vh] relative">
                <Asside />
            </nav>

            <section className="w-[70%] h-[100vh] relative p-3">
                <NavigationAdm title="LOCAIS" />
                <AddNewLocation />

                <div className="absolute flex flex-col w-full h-full top-[16vh] p-4 
                overflow-y-auto scrollbar scrollbar-thumb-[#18212f] scrollbar-track-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {localList.map((local, index) => (
                            <CardLocal 
                                key={index}
                                name={local.nome}
                                address={local.end_url_google}
                                admId={local.userAdmId}
                                Machines={local.Machines} 
                            />
                        ))}

                        <div 
                            onClick={OpenPainelLocation} 
                            className="md:w-[238px] w-full h-[240px] bg-zinc-800/50 
                            backdrop-blur-[12px] flex flex-col justify-center items-center 
                            text-white rounded-lg cursor-pointer group hover:bg-zinc-700/50 
                            transition-all duration-300 border-2 border-dashed border-white/20 
                            hover:border-[#e6a429]"
                        >
                            <span className="bg-zinc-700 w-[70px] h-[70px] 
                            flex justify-center items-center rounded-full text-[20pt]
                            group-hover:bg-[#e6a429] group-hover:scale-110 
                            transition-all duration-300">
                                <Add className="group-hover:rotate-90 transition-transform duration-300" />
                            </span>
                            <p className="mt-4 text-white/60 group-hover:text-white">
                                Adicionar Novo Local
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default PortalAdmLocais