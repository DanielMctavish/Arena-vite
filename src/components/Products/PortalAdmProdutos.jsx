/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import CardProdutos from "./CardProdutos";
import NavigationAdm from "../Portal-ADM/ADM-components/Navigation";
import Asside from "../Portal-ADM/ADM-components/Asside";
import { Add } from '@mui/icons-material'
//import dayjs from "dayjs";
import AddNewProduct from "./AddNewProduct";


function PortalAdmProdutos() {
    const [productList, setProductList] = useState([])
    const navigate = useNavigate();
    const getAdmSession = JSON.parse(localStorage.getItem("arena-adm-login"))
    const refAddProduct = useRef()

    useEffect(() => {
        if (!getAdmSession) {
            localStorage.removeItem("arena-adm-login")
            navigate("/adm-login")
        }
        loadProductList()
    }, [])

    const loadProductList = async () => {

        try {
            //#01
            const config = {
                headers: {
                    'Authorization': `Bearer ${getAdmSession.token}`
                }
            };
            const currentAdministrator =
                await axios.get(`${import.meta.env.VITE_APP_API_URL}/adm/admin-info-email?email=${getAdmSession.email}`, config)

            // #02
            await axios.get(`${import.meta.env.VITE_APP_API_URL}/product/list-products?owner_id=${currentAdministrator.data.id}`, config)
                .then(response => {
                    //console.log('lista de produtos ->', response.data);
                    setProductList(response.data)
                })

        } catch (error) {
            console.log('error loading list');
        }

    }

    const handleShowModalAddProduct = () => {
        refAddProduct.current.style.display = 'flex'
    }

    return (
        <div className="bg-zinc-100 w-full h-[100vh] 
        flex justify-center items-center absolute
        border-[10px] border-[#e6a429] overflow-hidden ">

            <Asside />
            <NavigationAdm title="PRODUTOS" name={getAdmSession.name} />

            <section className='absolute flex flex-wrap 
            justify-start items-start gap-3 sm:w-[70%] w-[94%] 
            sm:max-h-[78vh] max-h-[82vh] sm:right-[3vh] 
            right-auto top-[16vh] p-3 overflow-y-auto '>
                {productList.map((product, index) => (
                    <CardProdutos key={index} name={product.name} url_img={product.url_img} available={product.available} value={product.value} id={product.id} reload={loadProductList} />
                ))}

                <div
                    onClick={handleShowModalAddProduct}
                    className="w-[268px] h-[310px] hover:bg-[#212732] bg-[#3C4557] rounded-[10px] flex flex-col justify-around items-center text-white cursor-pointer">
                    <Add />
                </div>
            </section>

            <section
                ref={refAddProduct}
                className="w-full h-auto absolute hidden justify-center items-center mod-add-product">
                <AddNewProduct reload={loadProductList} />
            </section>

        </div>
    )
}

export default PortalAdmProdutos;