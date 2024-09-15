/* eslint-disable react-hooks/exhaustive-deps */
import backgroundPortal from "../../medias/backgrounds/elden-ring-godfrey.png"
import React, { useEffect, useState } from 'react';
import AssideGamer from './GAMER-components/AssideGamer';
import { useNavigate } from 'react-router-dom';
import { DesktopMac, AccessTime, AttachMoney } from "@mui/icons-material"
import axios from 'axios';

function PortalGamerDashboard() {
  const [clientSession, setClientSession] = useState(null)
  const [currentBalance, setCurrentBalance] = useState(0)
  const [lastSessions, setLastSessions] = useState([])
  const [totalSpent, setTotalSpent] = useState(0)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const clientSessionData = JSON.parse(localStorage.getItem('arena-client-login'))

      if (!clientSessionData || !clientSessionData.body) {
        navigate("/gamer-login")
        return
      }
      setClientSession(clientSessionData.body)

      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/client/find-by-email?email=${clientSessionData.body.email}`, {
          headers: { 'Authorization': `Bearer ${clientSessionData.token}` }
        });
        const clientData = response.data.body;
        console.log("clientData -> ", clientData)
        setCurrentBalance(clientData.horas || 0)

        const sessionsResponse = await axios.get(`${import.meta.env.VITE_APP_API_URL}/client/all-sessions?client_id=${clientData.id}`, {
          headers: { 'Authorization': `Bearer ${clientSessionData.token}` }
        });
        setLastSessions(sessionsResponse.data.body.slice(0, 5))

        const total = sessionsResponse.data.body.reduce((acc, session) => acc + (session.value || 0), 0);
        setTotalSpent(total);
      } catch (error) {
        console.error("Error fetching data:", error.response);
      }
    };

    fetchData();
  }, [navigate])

  return (
    <div id='portal-gamer-dashboard' className="bg-gradient-to-br from-purple-900 
    via-indigo-900 to-blue-900 w-full h-[100vh] flex justify-center 
    items-center border-[10px] border-[#7300F4] p-2 gap-1 relative">

      <img src={backgroundPortal} alt="" className='absolute top-0 left-0 w-full h-full object-cover opacity-30 blur-[4px]' />

      <AssideGamer />

      <section className='flex flex-wrap sm:w-[70%] w-full h-full 
      justify-center items-start relative bg-black/30
      rounded-[10px] backdrop-blur-[12px] gap-4 overflow-y-auto p-4'>

        {/* User Info Panel */}
        <div className='flex justify-center items-center w-full md:w-[48%] h-[200px] rounded-lg bg-white/10 text-white p-4 backdrop-filter backdrop-blur-lg'>
          <div className='flex gap-4 justify-between items-center w-full'>
            <img src={clientSession?.avatar_url || "https://via.placeholder.com/60"} alt="" className='w-[60px] h-[60px] rounded-full bg-white object-cover' />
            <div className='flex flex-col flex-grow'>
              <span className="text-2xl font-bold">{clientSession?.nome || "Nome do Usuário"}</span>
              <span className="text-sm opacity-75">{clientSession?.email || "email@example.com"}</span>
            </div>
          </div>
        </div>

        {/* Credit Balance Panel */}
        <div className='flex flex-col justify-center items-center w-full md:w-[48%] h-[200px] bg-white/10 text-white rounded-lg p-4 backdrop-filter backdrop-blur-lg'>
          <span className="text-xl mb-2">Crédito Disponível</span>
          <span className='text-5xl font-bold text-green-400'>{currentBalance.toFixed(2)} h</span>
        </div>

        {/* Recent Sessions Panel */}
        <div className='flex flex-col justify-start items-center w-full h-[300px] bg-white/10 text-white rounded-lg p-4 backdrop-filter backdrop-blur-lg overflow-hidden'>
          <span className='text-2xl font-bold mb-4'>Últimas Sessões</span>
          <div className="w-full overflow-y-auto">
            {lastSessions.map((session) => (
              <div key={session.id} className='flex w-full justify-between items-center py-2 border-b border-white/20'>
                <DesktopMac className="text-blue-300" />
                <span>{session.Machine?.nano_id || "Máquina"}</span>
                <span>{new Date(session.timer_started_at).toLocaleString()}</span>
                <span>{session.duration} min</span>
                <span className={`font-bold ${session.status === 'RUNNING' ? 'text-green-400' : 'text-yellow-400'}`}>
                  {session.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Total Spent Panel */}
        <div className='flex justify-center items-center w-full md:w-[48%] h-[200px] bg-white/10 text-white rounded-lg p-4 backdrop-filter backdrop-blur-lg'>
          <div className="flex flex-col items-center">
            <AttachMoney className="text-5xl mb-2 text-yellow-400" />
            <span className="text-xl">Total Gasto</span>
            <span className='text-3xl font-bold text-yellow-400'>R$ {totalSpent.toFixed(2)}</span>
          </div>
        </div>

        {/* Total Time Played Panel */}
        <div className='flex justify-center items-center w-full md:w-[48%] h-[200px] bg-white/10 text-white rounded-lg p-4 backdrop-filter backdrop-blur-lg'>
          <div className="flex flex-col items-center">
            <AccessTime className="text-5xl mb-2 text-purple-400" />
            <span className="text-xl">Tempo Total Jogado</span>
            <span className='text-3xl font-bold text-purple-400'>
              {lastSessions.reduce((acc, session) => acc + session.duration, 0)} min
            </span>
          </div>
        </div>

      </section>
    </div>
  );
}

export default PortalGamerDashboard;