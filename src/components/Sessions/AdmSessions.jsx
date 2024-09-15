/* eslint-disable no-unreachable */
/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BgAdm from '../../medias/bg-adm.png';
import NavigationAdm from '../navigation/Navigation';
import Asside from '../Asside/Asside';
import { getAdmInfoByEmail } from '../Portal-ADM/functions/getAdmInfoByEmail';

import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import { updateError } from '../../redux/access/ErrorSlice';
import { updateAdmin } from '../../redux/admin/AdminSlice';

const MACHINE_TYPE = {
    PC: 'PC',
    XBOX: 'XBOX',
    PS5: 'PS5',
    VR: 'VR',
    FLIPERAMA: 'FLIPERAMA',
    SIMULATOR: 'SIMULATOR'
};

function AdmSessions() {
    const navigate = useNavigate();
    const [currentSession, setCurrentSession] = useState({ name: "usuário" })
    const [importantsSessions, setImportantsSessions] = useState([])

    const dispatch = useDispatch()
    const stateError = useSelector(state => state.error_status)
    const stateAdmin = useSelector(state => state.admin)
    const stateMachine = useSelector(state => state.machine)

    useEffect(() => {
        const getAdmSession = JSON.parse(localStorage.getItem("arena-adm-login"))

        if (!getAdmSession) {
            localStorage.removeItem("arena-adm-login")
            navigate("/adm-login")
        }

        setCurrentSession(getAdmSession)
    }, [stateMachine])


    useEffect(() => {
        if (stateError === 500 || stateError === 401) {
            localStorage.removeItem('arena-adm-login')
            navigate("/adm-login")
        }

        getAdmInfoByEmail(currentSession.email, dispatch, updateError, updateAdmin)
    }, [currentSession, stateError])

    //--------------LIST SESSIONS-------------------------------------------------------------
    useEffect(() => {
        getAllSessions()
    }, [stateAdmin])

    const getAllSessions = async () => {
        const getAdmSession = JSON.parse(localStorage.getItem("arena-adm-login"))

        try {

            await axios.get(`${import.meta.env.VITE_APP_API_URL}/sessions/list-sessions`, {
                params: {
                    adm_id: stateAdmin.admin_id
                },
                headers: {
                    'Authorization': `Bearer ${getAdmSession.token}`
                }
            }).then(response => {
                console.log(response.data)
                setImportantsSessions(response.data)
            })

        } catch (error) {
            console.log("error at try getAllSessions -> ", error.message)
        }

    }

    return (
        <div
            style={{
                backgroundImage: `url(${BgAdm})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
            className="bg-zinc-800 w-full h-[100vh] 
                        flex justify-center items-center border-[10px] 
                        border-[#e6a429] relative overflow-hidden">

            <Asside />
            <NavigationAdm title="Sessões" adm_id={stateAdmin.admin_id} />

            <section className="flex flex-col lg:w-[70%] w-[98%] lg:h-[80%] h-[88%] backdrop-blur-[12px]
            lg:mt-[6vh] mt-[10vh] lg:right-[3vh] right-auto absolute overflow-y-auto gap-1 text-white">

                <table className="min-w-full bg-zinc-800 rounded-lg overflow-hidden">
                    <thead className=" text-white">
                        <tr>
                            <th className="w-1/5 py-2">Cliente</th>
                            <th className="w-1/5 py-2">Início da Sessão</th>
                            <th className="w-1/5 py-2">Fim da Sessão</th>
                            <th className="w-1/5 py-2">Total da Sessão</th>
                            <th className="w-1/5 py-2">Local</th>
                            <th className="w-1/5 py-2">Máquina</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            importantsSessions.map(session => {
                                const duration = dayjs(session.timer_ended_at).diff(dayjs(session.timer_started_at), 'minute');
                                return (
                                    <tr key={session.id} className="bg-gray-100 border-b border-gray-200">
                                        <td className="py-2 px-4 flex items-center gap-2 text-gray-800">
                                            <img src={session.Client.avatar_url} alt=""
                                                className="w-[33px] h-[33px] object-cover rounded-full" />
                                            <span>{session.Client.nome}</span>
                                        </td>
                                        <td className="py-2 px-4 text-gray-800">
                                            {dayjs(session.timer_started_at).format("DD/MM/YYYY HH:mm")}
                                        </td>
                                        <td className="py-2 px-4 text-gray-800">
                                            {dayjs(session.timer_ended_at).format("DD/MM/YYYY HH:mm")}
                                        </td>
                                        <td className="py-2 px-4 text-gray-800">
                                            {`${Math.floor(duration / 60)}h ${duration % 60}m`}
                                        </td>
                                        <td className="py-2 px-4 text-gray-800">
                                            {session.location && session.location.nome}
                                        </td>
                                        <td className="py-2 px-4 text-gray-800 font-bold">
                                            {`${session.Machine.nano_id} (${MACHINE_TYPE[session.Machine.type]})`}
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </section>

        </div>
    );
}

export default AdmSessions;