/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import "./PortalGamesDashboard.css"
import AssideGamer from './GAMER-components/AssideGamer';
import { useNavigate } from 'react-router-dom';
import { DesktopMac } from "@mui/icons-material"

function PortalGamerDashboard() {
  const [clientSession, setClientSesson] = useState()
  const [currentBalance, setCurrentBalance] = useState(0)
  const [lastSessions, setLastSessions] = useState([])

  const navigate = useNavigate()

  useEffect(() => {
    const ClientSession = JSON.parse(localStorage.getItem('arena-client-login'))
    setClientSesson(clientSession)
    setCurrentBalance(12)

    if (!ClientSession) {
      navigate("/gamer-login")
    }
  }, [])

  useState(() => {
    const newSessions = [];
    for (let index = 0; index < 22; index++) {
      newSessions.push(index);
    }
    setLastSessions(newSessions);
  }, [])

  return (
    <div id='portal-gamer-dashboard' className="bg-zinc-500 w-full h-[100vh] flex justify-center items-center border-[10px] border-[#7300F4] p-2 gap-1">
      <AssideGamer />

      <section className='flex flex-wrap sm:w-[70%] w-full h-full 
      justify-center items-center relative bg-gradient-to-r from-[#e6d0ff19] to-[#7200f483] 
      rounded-[10px] backdrop-blur-[12px] gap-[2px] overflow-y-auto'>

        {/* PAINEL 01 ---------------------------------------------------------------------------------------------------------- */}
        <div className='flex justify-center items-center w-[49%] h-[49%] rounded-lg bg-white/10 text-white'>

          <div className='flex gap-1 justify-between items-center sm:w-[40%] w-[80%]'>
            <img src="" alt="" className='min-w-[60px] min-h-[60px] rounded-full bg-white object-cover' />
            <div className='flex flex-col'>
              <span>nome do usuário</span>
              <span>email@email.com</span>
            </div>
          </div>

        </div>

        {/* PAINEL 02 ---------------------------------------------------------------------------------------------------------- */}
        <div className='flex flex-col justify-center items-center w-[49%] h-[49%] bg-white/10 text-white rounded-lg'>
          <span>crédito disponível</span>
          <span style={{ textShadow: "2px 2px 3px #1414148e" }} className='flex text-[44px] font-bold'>R$ {currentBalance.toFixed(2)}</span>
        </div>

        {/* PAINEL 03 ---------------------------------------------------------------------------------------------------------- */}
        <div className='flex flex-col justify-start items-center sm:w-[49%] w-[99%] h-[49%] bg-white/10 text-white rounded-lg gap-2 overflow-y-auto'>
          <span style={{ textShadow: "2px 2px 3px #1414148e" }} className='flex text-[34px] font-bold'>Últimas Sessões</span>
          {
            lastSessions.map((session, index) => {

              return (
                <div key={index} className='flex w-[90%] justify-between items-center'>
                  <DesktopMac />
                  <span>máquina 01</span>
                  <span>19/02/2024 às 14:30</span>
                  <span className='font-bold'>R$ 10.00</span>
                </div>
              )

            })
          }
        </div>

        {/* PAINEL 04 ---------------------------------------------------------------------------------------------------------- */}
        <div className='flex justify-center items-center sm:w-[49%] w-[99%] h-[49%] bg-white/10 text-white rounded-lg'>
          consumo
        </div>

      </section>

    </div>
  );
}

export default PortalGamerDashboard;