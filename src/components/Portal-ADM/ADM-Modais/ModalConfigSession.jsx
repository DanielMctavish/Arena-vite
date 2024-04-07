import React from "react";
import addCashIcon from "../../../medias/icons/Add-dollar.png"
import iconOk from "../../../medias/icons/Ok.png"
import iconCancel from "../../../medias/icons/Cancel.png"
import productCocke from "../../../medias/produtos/coca-cola-lata-350ml-min.png"

function ModalConfigSession() {
    const classeTimerStyle = "w-[74px] h-[74px] bg-[#2A303E] hover:bg-[#5c6c91] border-[1px] border-[#59698D] rounded-[4px] text-white flex justify-center items-center cursor-pointer"
    async function closeConfigSession() {
        const currentModal = document.getElementById("modal-config-session")
        currentModal.style.display = "none"
    }

    return (
        <div
            id="modal-config-session"
            className="absolute ml-[36%] mt-[2%] w-[60%] h-[70%] bg-zinc-100 z-[999] rounded-[6px] p-3 hidden flex-col justify-start items-center">

            <section className="bg-[#3C4557] w-[90%] h-[130px] rounded-[12px] flex justify-center items-center gap-3">

                <div className="w-[47%] h-[94%] flex justify-around items-center gap-3">
                    <img src="" alt="" className="w-[90px] h-[90px] bg-slate-800 rounded-full" />

                    <div className="text-white w-[260px] h-[70%] flex flex-col justify-between items-center">
                        <div className="w-full flex justify-between items-center gap-2">
                            <div className="font-bold">R$ 9999,99</div>
                            <img src={addCashIcon} alt="" className="cursor-pointer" />
                        </div>
                        <select name="" id="" className="text-zinc-600 p-1 w-[240px] rounded-[4px] border-[1px] border-[#CCC9C9]">
                            <option value="select-client">selecionar cliente</option>
                        </select>
                    </div>

                </div>

                <span className="h-[100%] w-[1px] bg-slate-500"></span>

                <div className="w-[47%] h-[94%] flex justify-between items-center">
                    <div className="w-[47%] h-full scrollbar scrollbar-thumb-gray-900 scrollbar-track-gray-100 text-white flex flex-col justify-start items-center gap-1 overflow-y-auto">
                        <span>+ 3 items tal</span>
                        <span>+ 3 items tal</span>
                        <span>+ 3 items tal</span>
                        <span>+ 3 items tal</span>
                        <span>+ 3 items tal</span>
                    </div>
                    <div className="flex justify-center items-center gap-3 w-[53%]">
                        <span className="text-red-400 font-bold">- R$ 100,00</span>
                        <img src={iconOk} alt="" className="cursor-pointer hover:brightness-[1.4]" />
                        <img src={iconCancel} alt="" className="cursor-pointer hover:brightness-[1.4]" onClick={closeConfigSession} />
                    </div>
                </div>
            </section>

            <h4 className="text-zinc-400">Sessão de consumo</h4>

            <section className="bg-[#3C4557] w-[90%] h-[284px] rounded-[12px] overflow-hidden flex justify-start items-center p-3 overflow-x-auto">
                <div className="w-[124px] h-[190px] bg-[#2A303E] rounded-[12px] border-[1px] border-[#59698D] flex flex-col justify-start items-center text-white gap-2">
                    <span>R$9,99</span>
                    <img src={productCocke} alt="" className="w-[91px] h-[91px] bg-zinc-400 rounded-[4px] object-cover" />
                    <span className="text-[10px]">coca-cola 350ml</span>
                    <input type="number" className="w-[30px] text-zinc-700 rounded-[4px] flex justify-center items-center p-[2px]" />
                </div>
            </section>

            <h4 className="text-zinc-400">Selecionar tempo</h4>

            <section className="bg-[#3C4557] w-[90%] h-[162px] rounded-[12px] flex justify-center items-center gap-6">

                <div className={classeTimerStyle}>
                    1h
                </div>
                <div className={classeTimerStyle}>
                    2h
                </div>
                <div className={classeTimerStyle}>
                    3h
                </div>
                <div className={classeTimerStyle}>
                    4h
                </div>
                <div className={classeTimerStyle}>
                    5h
                </div>

            </section>

        </div>
    )
}

export default ModalConfigSession;