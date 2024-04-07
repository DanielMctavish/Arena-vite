import { Close } from "@mui/icons-material";
import { useState } from "react";
import ComputerIcon from "../../medias/icons/iMac.png"

function ModConnectClient() {
    const [cardsMachines, setCardsMachines] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 5, 6])

    const handleCloseCurrentWindow = () => {
        const currentClientWindow = document.querySelector(".mod-connect-client");
        currentClientWindow.style.display = "none";
    }

    return (
        <div className="lg:w-[60%] w-[90%] h-[88%] flex 
            bg-gradient-to-r from-[#3c4557b6] via-[#2a4a5a] to-[#19223498] 
            backdrop-blur-lg text-white rounded-md 
            justify-center items-center gap-6 relative p-2
            shadow-lg shadow-[#0f0f0f4d] overflow-y-auto">

            <span onClick={handleCloseCurrentWindow} className="absolute top-1 right-1 text-zinc-100 cursor-pointer">
                <Close />
            </span>

            <section className="flex gap-1 w-[40%] h-[100%] bg-zinc-100/70 rounded-md overflow-y-auto p-3 relative">
                <div className="flex flex-col  h-auto justify-start items-start flex-wrap gap-1">
                    {
                        cardsMachines.map((card, index) => {
                            return (
                                <div key={index} className="min-w-[100px] h-[100px]
                                hover:bg-emerald-200 flex justify-center items-center
                                bg-emerald-600 rounded-md cursor-pointer">
                                    <img src={ComputerIcon} alt="" />
                                </div>
                            )
                        })
                    }
                </div>
            </section>

            <section className="flex flex-col w-[60%] h-[100%] p-4 gap-3">

                <div className="w-full h-[40%] border-[1px] border-bg-white rounded-md">

                </div>

                <div className="w-full h-[60%] border-[1px] border-bg-white rounded-md">

                </div>

            </section>

        </div>
    )
}

export default ModConnectClient;