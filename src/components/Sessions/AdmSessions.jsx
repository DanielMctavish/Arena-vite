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
                {
                    importantsSessions.map(session =>
                        <div key={session.id} className="flex justify-between items-center p-3 
                            border-[1px] border-[#e6a429] border-opacity-[0.5] rounded-md">

                            <div className="flex gap-2 justify-start items-center">
                                <img src={session.Client.avatar_url} alt=""
                                    className="w-[33px] object-cover rounded-full" />
                                <span>{session.Client.nome}</span>
                            </div>

                            <div className="flex w-[160px] gap-3 justify-between items-center">
                                <span>
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(session.value)}
                                </span>
                                <span>
                                    {`${Math.floor(session.duration / 60)}h ${session.duration % 60}m`}
                                </span>
                            </div>


                            <span>{dayjs(session.created_at).format("DD/MM/YYYY HH:mm")}</span>
                        </div>
                    )
                }
            </section>

        </div>
    );
}

export default AdmSessions;