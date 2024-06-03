import React from "react";
import { useDispatch } from "react-redux";
import { selectedClient } from "../../redux/client/ClientSlice";

function ClienteLinhaTd({ nome, email, value, avatar_url, client_id }) {

    const dispatch = useDispatch()

    const handleShowConnectClient = () => {
        const ModConnectClient = document.querySelector(".mod-connect-client")
        ModConnectClient.style.display = "flex";
    }

    const handleShowConsumoClient = () => {
        const ModConnectClient = document.querySelector(".mod-consumo-client")
        ModConnectClient.style.display = "flex";
    }

    const handleShowAddSaldo = () => {
        const ModConnectClient = document.querySelector(".mod-add-saldo-client")
        ModConnectClient.style.display = "flex";

        dispatch(selectedClient({
            client_id: client_id,
            nome: nome,
            value: value,
            avatar_url: avatar_url
        }))
    }

    return (
        <div className="bg-[#D9D9D9] md:h-[8vh] h-auto flex md:flex-row md:mt-0 mt-1 flex-col justify-around items-center p-1 rounded-md">
            <section className="flex w-[40%] justify-start items-center gap-3">
                <img src={avatar_url} alt="" className="w-[62px] h-[62px] rounded-full object-cover" />
                <span className="text-zinc-700 font-bold">{nome}</span>
                <span className="text-[#54678d]">{email}</span>
            </section>
            <section className="flex w-[40%] justify-between items-center">
                <span>
                    <button onClick={handleShowConnectClient} className="bg-[#31B255] p-2 rounded-[5px] text-white md:w-auto w-[180px]">
                        conectar
                    </button>
                </span>
                <span>
                    <button onClick={handleShowConsumoClient} className="bg-[#3C4557] p-2 rounded-[5px] text-white md:w-auto w-[180px]">
                        consumo
                    </button>
                </span>
                <span>
                    <button onClick={handleShowAddSaldo} className="bg-[#3C4557] p-2 rounded-[5px] text-white md:w-auto w-[180px]">
                        add saldo
                    </button>
                </span>
                <span>
                    <button className="bg-[#3C4557] p-2 rounded-[5px] text-white md:w-auto w-[180px]">
                        detalhes
                    </button>
                </span>
            </section>
            <span className="font-bold">R$ {value.toFixed(2)}</span>
        </div>
    )
}

export default ClienteLinhaTd;