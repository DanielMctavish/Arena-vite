/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useEffect, useState } from "react";

function CardLocal({ name, address, admId }) {
    const [currentAdm, setCurrentAdm] = useState({})

    useEffect(() => {
        getInformations()
    }, [])

    const getInformations = async () => {
        const currentSession = JSON.parse(localStorage.getItem('arena-adm-login'))

        try {

            await axios.get(`${import.meta.env.VITE_APP_API_URL}/adm/admin-info?adm_id=${admId}`, {
                headers: {
                    'Authorization': `Bearer ${currentSession.token}`
                }
            }).then((response) => {
                console.log('current Adm -> ', response.data)
                setCurrentAdm(response.data)
            })

        } catch (error) {
            console.error(error.message)
        }

    }

    return (
        <div className="md:w-[238px] w-[90%] h-[214px] bg-[#3C3C3C] flex flex-col justify-around items-center text-white rounded-[10px]">

            <h2 className="font-bold text-[18pt]">{name && name.toUpperCase()}</h2>
            <span>{currentAdm.Machines && currentAdm.Machines.length}</span>
            <img src={currentAdm.avatar_url && currentAdm.avatar_url} alt="avatar" className="w-[70px] h-[70px] border-[3px] border-white rounded-full object-cover" />
            <span className="text-[10pt]">{address}</span>

        </div>
    )
}

export default CardLocal;