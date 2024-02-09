import React from "react";
import avatarUser from "../../../medias/avatares/player.png"

function ClienteLinhaTd() {
    return (
        <tr className="bg-[#D9D9D9] md:h-[8vh] h-auto flex md:flex-row md:mt-0 mt-1 flex-col justify-around items-center p-1">
            <img src={avatarUser} alt="" className="w-[62px] h-[62px]" />
            <td>nome usuário</td>
            <td>email@email.com</td>
            <td><button className="bg-[#31B255] p-2 rounded-[5px] text-white md:w-auto w-[180px]">conectar</button></td>
            <td><button className="bg-[#3C4557] p-2 rounded-[5px] text-white md:w-auto w-[180px]">consumo</button></td>
            <td><button className="bg-[#3C4557] p-2 rounded-[5px] text-white md:w-auto w-[180px]">add saldo</button></td>
            <td><button className="bg-[#3C4557] p-2 rounded-[5px] text-white md:w-auto w-[180px]">detalhes</button></td>
            <td className="font-bold">R$ 250,00</td>
        </tr>
    )
}

export default ClienteLinhaTd;