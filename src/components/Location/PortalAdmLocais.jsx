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
        <div className="bg-zinc-100 w-full h-[100vh] flex justify-center items-center border-[10px] border-[#e6a429]">
            <Asside />
            <NavigationAdm title="LOCAIS" />
            <AddNewLocation />

            <section
                className='absolute flex flex-wrap md:justify-start justify-center items-start gap-1 sm:w-[66%] w-[98%] sm:max-h-[88vh] max-h-[82vh] sm:right-[3vh] right-auto top-[16vh] p-3 overflow-y-auto'>
                {
                    localList.map((local, index) => (
                        <CardLocal key={index}
                            name={local.nome}
                            address={local.end_url_google}
                            admId={local.userAdmId}
                            Machines={local.Machines} />
                    ))
                }

                <div onClick={OpenPainelLocation} className="md:w-[238px] w-[90%] h-[240px] bg-[#3C3C3C] flex flex-col justify-around items-center text-white rounded-[10px] cursor-pointer">
                    <span className="bg-zinc-500 w-[70px] h-[70px] flex justify-center items-center rounded-full text-[20pt]"><Add /></span>
                </div>

            </section>
        </div>
    )
}

export default PortalAdmLocais