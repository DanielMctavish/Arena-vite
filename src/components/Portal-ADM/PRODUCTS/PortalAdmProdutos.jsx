/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import CardProdutos from "../ADM-components/CardProdutos";
import NavigationAdm from "../ADM-components/Navigation";
import Asside from "../ADM-components/Asside";
import { Add } from '@mui/icons-material'
import dayjs from "dayjs";
import AddNewProduct from "../ADM-Modais/AddNewProduct";

function PortalAdmProdutos() {
    const navigate = useNavigate();
    const getAdmSession = JSON.parse(localStorage.getItem("arena-adm-login"))
    const refAddProduct = useRef()

    useEffect(() => {
        if (!getAdmSession) {
            localStorage.removeItem("arena-adm-login")
            navigate("/adm-login")
        }
    }, [])

    const handleShowModalAddProduct = () => {
        refAddProduct.current.style.display = 'flex'
    }

    return (
        <div className="bg-zinc-100 w-full h-[100vh] 
        flex justify-center items-center absolute
        border-[10px] border-[#e6a429] overflow-hidden">
    
            <Asside />
            <NavigationAdm title="PRODUTOS" name={getAdmSession.name} />

            <section className='absolute flex flex-wrap justify-start items-start gap-3 sm:w-[66%] w-[94%] sm:max-h-[78vh] max-h-[82vh] sm:right-[3vh] right-auto top-[16vh] p-3 overflow-y-auto'>
                <CardProdutos />

                <div
                    onClick={handleShowModalAddProduct}
                    className="w-[268px] h-[310px] hover:bg-[#212732] bg-[#3C4557] rounded-[10px] flex flex-col justify-around items-center text-white cursor-pointer">
                    <Add />
                </div>
            </section>

            <section 
            ref={refAddProduct}
            className="w-full h-auto absolute hidden justify-center items-center mod-add-product">
                <AddNewProduct/>
            </section>

        </div>
    )
}

export default PortalAdmProdutos;