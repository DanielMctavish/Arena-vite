import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import CardProdutos from "./ADM-components/CardProdutos";
import NavigationAdm from "./ADM-components/Navigation";
import Asside from "./ADM-components/Asside";
import { Add } from '@mui/icons-material'
import dayjs from "dayjs";

function PortalAdmProdutos() {

    const navigate = useNavigate();

    useEffect(() => {
        const getCookie = localStorage.getItem('test-login')

        if (parseInt(getCookie) > dayjs().valueOf()) {
            return console.log('sessão válida');
        } else {
            return navigate("/adm-login")
        }

    })

    return (
        <div className="bg-zinc-100 w-full h-[100vh] flex justify-center items-center border-[10px] border-[#e6a429] overflow-hidden">
            <Asside />
            <NavigationAdm title="PRODUTOS" />

            <section className='absolute flex flex-wrap justify-start items-start gap-3 sm:w-[66%] w-[94%] sm:max-h-[78vh] max-h-[82vh] sm:right-[3vh] right-auto top-[16vh] p-3 overflow-y-auto'>
                <CardProdutos />
                <CardProdutos />
                <CardProdutos />
                <CardProdutos />
                <CardProdutos />
                <CardProdutos />

                <div className="w-[268px] h-[310px] hover:bg-[#212732] bg-[#3C4557] rounded-[10px] flex flex-col justify-around items-center text-white cursor-pointer">
                    <Add />
                </div>
            </section>
        </div>
    )
}

export default PortalAdmProdutos;