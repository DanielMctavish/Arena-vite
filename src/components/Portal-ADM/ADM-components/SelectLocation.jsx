import React from "react";

function SelectLocation({ localList, setLocalId }) {
    return (
        <div className="relative">

            <select name="" id=""
                onChange={(e) => setLocalId(e.target.value)}
                className="w-[200px] p-1 bg-[#DA9A1F] text-white text-center flex justify-around items-center rounded-[6px]">
                <option value="Arena central">selecione um local</option>
                {
                    localList.map((local, i) => (
                        <option key={i} value={local.id}>{local.nome}</option>
                    ))
                }
            </select>

        </div>
    )
}

export default SelectLocation