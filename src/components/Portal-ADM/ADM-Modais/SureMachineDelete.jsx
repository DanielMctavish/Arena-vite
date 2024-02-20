import React, { useEffect } from "react";
import WarningIcon from "../../../medias/icons/BoxImportant.png";

function SureMachineDelete() {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { }, []);

    function CloseWindowWarning() {
        const currentWindow = document.querySelector(".windows-del-warning");
        currentWindow.style.display = "none";
    }

    return (

        <div className="draggable-container">

            <div
                className="windows-del-warning 
                    w-[636px] h-[337px] hidden absolute
                    flex-col justify-around 
                    items-center bg-[#201733] 
                    border-[1px] border-[#C8D3E9] 
                    rounded-[10px] text-white z-[60]"
            >
                <img src={WarningIcon} alt="icon de aviso" />
                <span>VOCÊ TEM CERTEZA QUE DESEJA EXCLUIR A MÁQUINA?</span>

                <section className="flex gap-3">
                    <input
                        type="password"
                        placeholder="confirme sua senha"
                        className="text-zinc-700 text-center p-2 rounded-md"
                    />
                    <button className="text-[#FF5454]">DELETAR</button>
                </section>

                <button onClick={CloseWindowWarning}>CANCELAR</button>
            </div>

        </div>

    );
}

export default SureMachineDelete;
