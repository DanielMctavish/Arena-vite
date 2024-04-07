import React, { useState } from "react";
import Draggable from "react-draggable";
import MapContainer from "./MapContainer";

function AddNewLocation() {
    const [address, setAddress] = useState("");

    function closePanelLocation() {
        const currentPanel = document.querySelector(".painel-local");
        currentPanel.style.display = "none";
    }

    function handleAddressChange(event) {
        setAddress(event.target.value);
    }

    return (
        <Draggable>
            <div className="painel-local absolute text-white font-bold w-[503px] h-[765px] bg-[#273249] rounded-[10px] border-[1px] border-[#8FA5CF] hidden flex-col justify-around items-center z-50">
                <span
                    onClick={closePanelLocation}
                    className="absolute right-2 top-2 cursor-pointer w-[26px] h-[26px] rounded-full bg-gradient-to-r from-[#FF0000] to-[#fe5b5b] border-[2px] border-white"
                ></span>
                <h2>REGISTRAR LOCAL</h2>
                <input
                    type="text"
                    placeholder="Nome do local"
                    className="w-[210px] h-[30px] bg-[#F5F5F5] text-zinc-600 text-center rounded-[4px]"
                />

                <select
                    className="w-[210px] h-[30px] bg-[#F5F5F5] text-zinc-600 text-center rounded-[4px]"
                    defaultValue="proprietário"
                >
                    <option value="proprietário">Selecione o proprietário</option>
                    <option value="Richard Luca">Richard Luca</option>
                    <option value="Fulano">Fulano</option>
                    <option value="Beltrano">Beltrano</option>
                </select>

                <input
                    type="text"
                    placeholder="Digite o endereço"
                    value={address}
                    onChange={handleAddressChange}
                    className="w-[210px] h-[30px] bg-[#F5F5F5] text-zinc-600 text-center rounded-[4px]"
                />
                {address && <MapContainer address={address} />}
                <button>registrar local</button>
            </div>
        </Draggable>
    );
}

export default AddNewLocation;
