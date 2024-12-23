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
        <div className="bg-zinc-800 w-full h-[100vh] 
        flex justify-center items-center border-[10px] 
        border-[#e6a429] relative overflow-hidden">
            <nav className="w-[30%] h-[100vh] relative">
                <Asside />
            </nav>

            <section className="w-[70%] h-[100vh] relative p-3">
                <NavigationAdm title="LOCAIS" />
                <AddNewLocation />

                <div className="absolute flex flex-col w-full h-full top-[16vh] p-1 
                overflow-y-auto scrollbar scrollbar-thumb-[#18212f] scrollbar-track-gray-100">
                    <div className="flex flex-wrap gap-4 w-[98%]">
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
                            className="w-[238px] h-[240px] bg-zinc-800/50 backdrop-blur-[12px] 
                            flex flex-col justify-around items-center text-white rounded-lg 
                            cursor-pointer hover:bg-zinc-700/50 transition-colors"
                        >
                            <span className="bg-zinc-700 w-[70px] h-[70px] 
                            flex justify-center items-center rounded-full text-[20pt]
                            hover:bg-zinc-600 transition-colors">
                                <Add />
                            </span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default PortalAdmLocais