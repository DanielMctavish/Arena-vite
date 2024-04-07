import React from "react";

function SelectLocation() {
    return (
        <div className="absolute top-[12vh] sm:left-[35%] left-auto">
            <select name="" id="" className="w-[200px] p-1 bg-[#DA9A1F] text-white text-center flex justify-around items-center rounded-[2px]">
                <option value="Arena central">Arena central</option>
                <option value="Shopping A">Shopping A</option>
                <option value="Shopping B">Shopping B</option>
                <option value="Shopping C">Shopping C</option>
                <option value="Shopping D">Shopping D</option>
            </select>
        </div>
    )
}

export default SelectLocation