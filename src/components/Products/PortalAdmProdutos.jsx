/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import CardProdutos from "./CardProdutos";
import NavigationAdm from "../navigation/Navigation";
import Asside from "../Asside/Asside";
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
        <div className="bg-zinc-800 w-full h-[100vh] 
        flex justify-center items-center border-[10px] 
        border-[#e6a429] relative overflow-hidden">
            <nav className="w-[30%] h-[100vh] relative">
                <Asside />
            </nav>

            <section className="w-[70%] h-[100vh] relative p-3">
                <NavigationAdm title="PRODUTOS" name={getAdmSession.name} />

                <div className="absolute flex flex-col w-full h-[80vh] top-[16vh] p-1 
                overflow-y-auto scrollbar scrollbar-thumb-[#18212f] scrollbar-track-gray-100">
                    <div className="flex flex-wrap gap-4 w-[98%]">
                        {productList.map((product, index) => (
                            <CardProdutos 
                                key={index} 
                                name={product.name} 
                                url_img={product.url_img} 
                                available={product.available} 
                                value={product.value} 
                                id={product.id} 
                                reload={loadProductList} 
                            />
                        ))}

                        <div
                            onClick={handleShowModalAddProduct}
                            className="w-[268px] h-[310px] bg-zinc-800/50 backdrop-blur-[12px] 
                            rounded-lg flex flex-col justify-around items-center text-white 
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

                <section
                    ref={refAddProduct}
                    className="w-full h-auto absolute hidden justify-center items-center mod-add-product z-50"
                >
                    <AddNewProduct reload={loadProductList} />
                </section>
            </section>
        </div>
    );
}

export default PortalAdmProdutos;