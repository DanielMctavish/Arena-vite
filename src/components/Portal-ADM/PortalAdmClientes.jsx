import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Asside from "./ADM-components/Asside";
import NavigationAdm from "./ADM-components/Navigation";
import ClienteLinhaTd from "./ADM-components/ClienteLinhaTd";
import dayjs from "dayjs";

function PortalAdmClientes() {

    const navigate = useNavigate();

    useEffect(() => {
        const getCookie = localStorage.getItem('test-login')

        if (parseInt(getCookie) > dayjs().valueOf()) {
            return console.log('sessão válida');
        } else {
            return navigate("/adm-login")
        }

    })

    return (
        <div className="bg-zinc-100 w-full h-[100vh] flex justify-center items-center border-[10px] border-[#e6a429]">
            <Asside />
            <NavigationAdm title="CLIENTES" />

            <section className='absolute flex flex-wrap justify-center items-start gap-3 sm:w-[66%] w-[94%] sm:max-h-[76vh] max-h-[77vh] sm:right-[3vh] right-auto top-[16vh] p-3 overflow-y-auto'>
                <table className="text-zinc-900 w-[100%] p-6">
                    <ClienteLinhaTd />
                    <ClienteLinhaTd />
                    <ClienteLinhaTd />
                    <ClienteLinhaTd />
                    <ClienteLinhaTd />
                    <ClienteLinhaTd />
                    <ClienteLinhaTd />
                    <ClienteLinhaTd />
                    <ClienteLinhaTd />
                    <ClienteLinhaTd />
                    <ClienteLinhaTd />
                    <ClienteLinhaTd />
                </table>
            </section>
        </div>
    )
}

export default PortalAdmClientes;