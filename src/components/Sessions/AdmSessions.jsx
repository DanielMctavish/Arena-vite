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
        <div className="bg-zinc-800 w-full h-[100vh] 
        flex justify-center items-center border-[10px] 
        border-[#e6a429] relative overflow-hidden"
        style={{
            backgroundImage: `url(${BgAdm})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
        }}>
            <nav className="w-[30%] h-[100vh] relative">
                <Asside />
            </nav>

            <section className="w-[70%] h-[100vh] relative p-3">
                <NavigationAdm title="SESSÕES" adm_id={stateAdmin.admin_id} />

                <div className="absolute flex flex-col w-full max-h-[78vh] top-[16vh] p-1 
                overflow-y-auto scrollbar scrollbar-thumb-[#18212f] scrollbar-track-gray-100">
                    <table className="w-[98%] bg-zinc-800/50 backdrop-blur-[12px] rounded-lg overflow-hidden">
                        <thead className="text-white border-b border-purple-500/30">
                            <tr>
                                <th className="w-1/5 py-4">Cliente</th>
                                <th className="w-1/5 py-4">Início da Sessão</th>
                                <th className="w-1/5 py-4">Fim da Sessão</th>
                                <th className="w-1/5 py-4">Total da Sessão</th>
                                <th className="w-1/5 py-4">Local</th>
                                <th className="w-1/5 py-4">Máquina</th>
                            </tr>
                        </thead>
                        <tbody>
                            {importantsSessions.map(session => {
                                const duration = dayjs(session.timer_ended_at).diff(dayjs(session.timer_started_at), 'minute');
                                return (
                                    <tr key={session.id} className="border-b border-purple-500/10 hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-4 flex items-center gap-2 text-white">
                                            <img src={session.Client.avatar_url} alt=""
                                                className="w-[33px] h-[33px] object-cover rounded-full" />
                                            <span>{session.Client.nome}</span>
                                        </td>
                                        <td className="py-4 px-4 text-white text-center">
                                            {dayjs(session.timer_started_at).format("DD/MM/YYYY HH:mm")}
                                        </td>
                                        <td className="py-4 px-4 text-white text-center">
                                            {dayjs(session.timer_ended_at).format("DD/MM/YYYY HH:mm")}
                                        </td>
                                        <td className="py-4 px-4 text-white text-center">
                                            {`${Math.floor(duration / 60)}h ${duration % 60}m`}
                                        </td>
                                        <td className="py-4 px-4 text-white text-center">
                                            {session.location && session.location.nome}
                                        </td>
                                        <td className="py-4 px-4 text-white text-center font-bold">
                                            {`${session.Machine.nano_id} (${MACHINE_TYPE[session.Machine.type]})`}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

export default AdmSessions;