/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useEffect, useState } from "react";
import { LocationOn } from '@mui/icons-material'; // Importando o ícone genérico de localização

function CardLocal({ name, address, admId, Machines }) {
    const [currentAdm, setCurrentAdm] = useState({})

    useEffect(() => {
        getInformations()
    }, [])

    const getInformations = async () => {
        const currentSession = JSON.parse(localStorage.getItem('arena-adm-login'))

        try {

            await axios.get(`${import.meta.env.VITE_APP_API_URL}/adm/admin-info`, {
                params: {
                    adm_id: admId,
                },
                headers: {
                    'Authorization': `Bearer ${currentSession.token}`
                }
            }).then((response) => {
                console.log('current Adm -> ', response.data.Machines.length)
                setCurrentAdm(response.data)
            })

        } catch (error) {
            console.error(error.message)
        }

    }

    return (
        <div className="md:w-[238px] w-[90%] h-[240px] bg-[#3C3C3C] flex flex-col justify-around items-center text-white rounded-[10px]">

            <h2 className="font-bold text-[18px]">{name && name.toUpperCase()}</h2>
            <span>{Machines && Machines.length}</span>
            {currentAdm.avatar_url ? (
                <img src={currentAdm.avatar_url} alt="avatar" className="w-[70px] h-[70px] border-[3px] border-white rounded-full object-cover" />
            ) : (
                <LocationOn className="text-white" style={{ fontSize: 70 }} />
            )}
            <span className="text-[10pt]">{address}</span>

        </div>
    )
}

export default CardLocal;