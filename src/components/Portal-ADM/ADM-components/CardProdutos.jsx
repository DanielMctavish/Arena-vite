import React from "react";
import cocaProd from "../../../medias/produtos/coca-cola-lata-350ml-min.png"

function CardProdutos(){
    return(
        <div className="w-[268px] h-[310px] bg-[#3C4557] 
        rounded-[10px] flex flex-col shadow-lg shadow-[#0808083e]
        justify-around items-center text-white">
            <span className="font-bold">R$ 5,00</span>
            <img src={cocaProd} alt="foto de produto"  className="w-[200px] h-[200px]"/>
            <span>coca-cola 350ml</span>
            <span className="text-[8pt] text-[#92F82C]">100 disponíveis</span>
        </div>
    )
}

export default CardProdutos;