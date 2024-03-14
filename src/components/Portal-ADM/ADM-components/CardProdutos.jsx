import React from "react";
import axios from "axios"
import { DeleteForever } from "@mui/icons-material"

function CardProdutos({ name, url_img, available, value, id, reload }) {

    const handleDeleteCurrentProduct = async () => {
        console.log('observando product _>', id);
        await axios.delete(`${import.meta.env.VITE_APP_API_URL}/product/delete`)

        try {
            
        } catch (error) {
            
        }
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