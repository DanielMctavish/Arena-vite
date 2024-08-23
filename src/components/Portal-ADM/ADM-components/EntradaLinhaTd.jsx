/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import axios from "axios"

function EntradaLinhaTd({ position, user_id, value, type, payment_method, status, date, fluxo }) {
    const [currentUser, setCurrentUser] = useState()

    useEffect(() => {
        getCurrentUser()
    }, [])

    const getCurrentUser = async () => {
        const currentSession = JSON.parse(localStorage.getItem("arena-adm-login"))

        await axios.get(`${import.meta.env.VITE_APP_API_URL}/client/find?client_id=${user_id}`, {
            headers: {
                'Authorization': `Bearer ${currentSession.token}`
            }
        }).then(result => {
            setCurrentUser(result.data.body)
        })

    }

    return (
        <tr className={`border-zinc-800 p-2 h-[40px] text-[12px] text-center mt-[3vh] ${fluxo === 'IN' ? 'bg-[#44ff7018]' : 'bg-[#fc58581f]'}`}>
            <td className="border-[1px] border-zinc-300">{position + 1}</td>
            <td className="flex h-[40px] justify-start items-center gap-1 border-[1px] border-zinc-300">
                <img src={currentUser && currentUser.avatar_url} alt="" className="w-[30px] object- rounded-full" />
                {currentUser && currentUser.nome}
            </td>
            <td className="border-[1px] border-zinc-300">R$ {value && value.toFixed(2)}</td>
            <td className="border-[1px] border-zinc-300">{type}</td>
            <td className="border-[1px] border-zinc-300">{payment_method}</td>
            <td className="border-[1px] border-zinc-300">{status}</td>
            <td className="border-[1px] border-zinc-300">{date && dayjs(date).format('DD/MM/YYYY HH:mm')}</td>
        </tr>
    )
}

export default EntradaLinhaTd;