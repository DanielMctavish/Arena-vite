import React, { useState } from "react";
import axios from "axios"
import { DeleteForever } from "@mui/icons-material"

function CardProdutos({ name, url_img, available, value, id, reload }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const getAdmSession = JSON.parse(localStorage.getItem("arena-adm-login"))
    const authorizationConfig = {
        headers: {
            'Authorization': `Bearer ${getAdmSession.token}`
        }
    };


    const handleDeleteCurrentProduct = async () => {
        console.log('observando product _>', id);
        setIsDeleting(true)

        try {

            await axios.delete(`${import.meta.env.VITE_APP_API_URL}/product/delete-product?product_id=${id}`, authorizationConfig)
                .then(async () => {
                    await axios.delete(`${import.meta.env.VITE_APP_API_URL}/product/delete-product-cover-img?url_image=${url_img}`)
                    setIsDeleting(false)
                    reload()
                })

        } catch (error) {

            console.log('erro ao tentar excluir produto _>', error.message);
            setIsDeleting(false)

        }
    }

    if (isDeleting) {
        return (
            <div className="w-[268px] h-[310px] bg-[#3C4557] 
            rounded-[10px] flex flex-col shadow-lg shadow-[#0808083e]
            justify-around items-center text-white relative">
                <span>excluindo...</span>
            </div>
        )
    }

    return (
        <div draggable className="w-[268px] h-[310px] bg-[#3C4557] 
        rounded-[10px] flex flex-col shadow-lg shadow-[#0808083e]
        justify-around items-center text-white relative">
            <span className="font-bold">R${value.toFixed(2)}</span>
            <img src={url_img} alt="foto de produto" className="w-[200px] h-[200px] object-cover rounded-md" />
            <span>{name}</span>
            <span className="text-[8pt] text-[#92F82C]">{available} disponíveis</span>

            <span className="absolute bottom-1 right-1">
                <button onClick={handleDeleteCurrentProduct} className="hover:text-red-600">
                    <DeleteForever />
                </button>
            </span>
        </div>
    )
}

export default CardProdutos;