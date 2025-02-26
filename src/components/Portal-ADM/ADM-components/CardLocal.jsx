/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useEffect, useState } from "react";
import { LocationOn, Computer } from '@mui/icons-material';

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
        <div className="md:w-[238px] w-[90%] h-[240px] bg-[#3C3C3C] flex flex-col 
        justify-between items-center text-white rounded-lg shadow-lg hover:shadow-xl 
        transition-all duration-300 p-6 relative overflow-hidden group">
            {/* Efeito de brilho no card */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent 
            opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Título */}
            <h2 className="font-bold text-xl tracking-wide">{name && name.toUpperCase()}</h2>

            {/* Contador de máquinas */}
            <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-full">
                <Computer className="text-[#e6a429]" />
                <span className="font-medium">{Machines?.length || 0} máquinas</span>
            </div>

            {/* Avatar/Ícone */}
            <div className="relative">
                {currentAdm.avatar_url ? (
                    <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r 
                        from-[#e6a429] to-[#ffd700] animate-spin"></div>
                        <img 
                            src={currentAdm.avatar_url} 
                            alt="avatar" 
                            className="w-[70px] h-[70px] border-4 border-[#3C3C3C] 
                            rounded-full object-cover relative z-10"
                        />
                    </div>
                ) : (
                    <div className="w-[70px] h-[70px] rounded-full bg-[#e6a429] 
                    flex items-center justify-center">
                        <LocationOn className="text-[#3C3C3C]" style={{ fontSize: 40 }} />
                    </div>
                )}
            </div>

            {/* Endereço em tooltip */}
            {address && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/80 py-2 px-3 
                text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 
                truncate text-center">
                    {address}
                </div>
            )}
        </div>
    )
}

export default CardLocal;