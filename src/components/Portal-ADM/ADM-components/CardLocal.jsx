import React from "react";
import RichardAvatar from "../../../medias/avatares/richard.png"

function CardLocal() {
    return (
        <div className="md:w-[238px] w-[90%] h-[214px] bg-[#3C3C3C] flex flex-col justify-around items-center text-white rounded-[10px]">

            <h2 className="font-bold text-[18pt]">ARENA JAF</h2>
            <span>20 máquinas</span>
            <img src={RichardAvatar} alt="avatar" className="w-[70px] h-[70px] border-[3px] border-white rounded-full" />
            <span className="text-[10pt]">rua tal, nº 100, narnia MG - BRASIL</span>

        </div>
    )
}

export default CardLocal;