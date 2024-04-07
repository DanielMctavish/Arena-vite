import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Asside from "../Asside/Asside";
import NavigationAdm from "../navigation/Navigation";
import CardLocal from "../Portal-ADM/ADM-components/CardLocal";
import { Add } from '@mui/icons-material'
import AddNewLocation from "../Portal-ADM/ADM-Modais/AddNewLocation";
import dayjs from "dayjs";

function PortalAdmLocais(props) {

    const navigate = useNavigate();

   

    function OpenPainelLocation() {
        const currentPainel = document.querySelector(".painel-local")
        currentPainel.style.display = 'flex';
    }

    return (
        <div className="bg-zinc-100 w-full h-[100vh] flex justify-center items-center border-[10px] border-[#e6a429]">
            <Asside />
            <NavigationAdm title="LOCAIS" />
            <AddNewLocation />

            <section
                className='absolute flex flex-wrap md:justify-start justify-center items-start gap-1 sm:w-[66%] w-[98%] sm:max-h-[88vh] max-h-[82vh] sm:right-[3vh] right-auto top-[16vh] p-3 overflow-y-auto'>
                <CardLocal />
                <CardLocal />
                <CardLocal />
                <CardLocal />
                <CardLocal />
                <CardLocal />
                <CardLocal />

                <div onClick={OpenPainelLocation} className="md:w-[238px] w-[90%] h-[214px] bg-[#3C3C3C] flex flex-col justify-around items-center text-white rounded-[10px] cursor-pointer">
                    <span className="bg-zinc-500 w-[70px] h-[70px] flex justify-center items-center rounded-full text-[20pt]"><Add /></span>
                </div>

            </section>
        </div>
    )
}

export default PortalAdmLocais