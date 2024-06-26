/* eslint-disable react-hooks/exhaustive-deps */
// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useEffect, useState } from "react";
import axios from "axios"
import WarningIcon from "../../../medias/icons/BoxImportant.png";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { machineToDelete } from "../../../redux/machines/MachineSlice";

function SureMachineDelete() {
    const [password, setPassword] = useState("")
    const [session, setSession] = useState()
    const machineState = useSelector(state => state.machine)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        const getAdmSession = JSON.parse(localStorage.getItem("arena-adm-login"))
        if (!getAdmSession) {
            localStorage.removeItem("arena-adm-login")
            navigate("/adm-login")
        }
        setSession(getAdmSession)
    }, [password]);

    function CloseWindowWarning() {
        const currentWindow = document.querySelector(".windows-del-warning");
        currentWindow.style.display = "none";
    }

    const handleDeleteMachine = async () => {

        console.log("machine to delete -> ", machineState)

        try {

            await axios.post(`${import.meta.env.VITE_APP_API_URL}/adm/login`, {
                email: session.email,
                senha: password
            })

            await axios.delete(`${import.meta.env.VITE_APP_API_URL}/adm/delete-machine?machine_id=${machineState.machine_id}`, {
                headers: {
                    Authorization: `Bearer ${session.token}`
                }
            }).then(() => {
                setPassword("")
            })

            CloseWindowWarning()
            dispatch(machineToDelete({
                machine_id: ""
            }))

        } catch (error) {
            
            setPassword("")
            console.log('erro ao tentar excluir máquina -> ', error.response)

        }

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
                <span className="font-bold">{machineState.nano_id}</span>

                <section className="flex gap-3">
                    <input
                        type="password"
                        placeholder="confirme sua senha"
                        className="text-zinc-700 text-center p-2 rounded-md"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button onClick={handleDeleteMachine} className="text-[#FF5454]">DELETAR</button>
                </section>

                <button onClick={CloseWindowWarning}>CANCELAR</button>
            </div>

        </div>

    );
}

export default SureMachineDelete;
