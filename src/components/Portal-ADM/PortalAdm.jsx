/* eslint-disable no-unreachable */
/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BgAdm from '../../medias/bg-adm.png';
import PS_logo from "../../medias/logos/PlayStation-Logo.png"
import Xbox_logo from "../../medias/logos/Xbox-Logo.png"
import ComputerIcon from "../../medias/icons/iMac.png"
import "./styles/PortalAdm.css"

import CardMachine from './ADM-components/CardMachine';
import NavigationAdm from '../navigation/Navigation';
import Asside from '../Asside/Asside';
import SelectLocation from './ADM-components/SelectLocation';
import { Add, Close } from '@mui/icons-material'
import ModalConfigSession from './ADM-Modais/ModalConfigSession';
import SureMachineDelete from './ADM-Modais/SureMachineDelete';
import { generateCustomID } from './functions/generateCustomID';
import { handleInitializeCreateMachine } from './functions/handleInitializeCreateMachine';
import { handleCreateMachine } from './functions/handleCreateMachine';
import { getAdmInfoByEmail } from './functions/getAdmInfoByEmail';

import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import { updateError } from '../../redux/access/ErrorSlice';
import { updateAdmin } from '../../redux/admin/AdminSlice';
import LoadingComp from "../load/LoadingComp";

function PortalAdm() {
  const navigate = useNavigate();
  const [locationList, setLocationList] = useState([])
  const [localSelected, setLocalId] = useState("")
  const [currentSession, setCurrentSession] = useState({ name: "usuário" })
  const [currentNanoID, setCurrentNanoID] = useState('')
  const [machineType, setMachineType] = useState('PC')
  const [isLoading, setIsLoading] = useState(false)

  const refCreateSession = useRef()
  const dispatch = useDispatch()
  const stateError = useSelector(state => state.error_status)
  const stateAdmin = useSelector(state => state.admin)
  const stateMachine = useSelector(state => state.machine)

  useEffect(() => {
    getLocationList()
  }, [isLoading]);

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

  const getLocationList = async () => {
    try {
      const currentSession = JSON.parse(localStorage.getItem('arena-adm-login'));

      await axios.get(`${import.meta.env.VITE_APP_API_URL}/adm/admin-info-email?email=${currentSession.email}`, {
        headers: {
          'Authorization': `Bearer ${currentSession.token}`
        }
      }).then((response) => {
        console.log("locationList -> ", response.data.ArenaLocal)
        // Ordenar as máquinas por posição em cada local
        const sortedLocations = response.data.ArenaLocal.map(location => ({
          ...location,
          Machines: location.Machines.sort((a, b) => a.position - b.position)
        }));
        setLocationList(sortedLocations)
      })

    } catch (error) {
      localStorage.removeItem("arena-adm-login")
      navigate("/adm-login")
      console.log(error.message)
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
        <NavigationAdm title="MÁQUINAS" adm_id={stateAdmin.admin_id} />
        <ModalConfigSession />
        <SureMachineDelete setIsLoading={setIsLoading} isLoading={isLoading} />

        <div className='absolute flex flex-col
        justify-start items-start 
        gap-1 w-full 
        max-h-[78vh]
        top-[16vh] 
        p-1 overflow-y-auto scrollbar 
        scrollbar-thumb-[#18212f] scrollbar-track-gray-100'>
          
          <SelectLocation localList={locationList} setLocalId={setLocalId} />

          {locationList.map((local) => (
            local.Machines.length > 0 &&
            <section key={local.id} className="flex flex-col w-full text-white relative">
              <span className="text-[22px]">{local.nome}</span>

              <div className="flex flex-wrap gap-2 p-3 w-full max-h-[60vh]
              overflow-y-auto overflow-x-hidden rounded-[12px]
              justify-start items-start bg-[#5e30ba1c] backdrop-blur-[6px] relative">
                {local.Machines && local.Machines.map((machine, i) => (
                  <CardMachine key={machine.id} machine={machine} index={i} />
                ))}
              </div>
            </section>
          ))}

          <div
            onClick={() => handleInitializeCreateMachine(refCreateSession, setCurrentNanoID, generateCustomID)}
            className="add-machine w-[160px] min-h-[233px] bg-[#1f2735] hover:bg-[#18212f] 
            cursor-pointer border-[1px] border-[#8499c2] rounded-[10px] 
            flex flex-col justify-center items-center text-white">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <Add />
          </div>
        </div>
      </section>

      {/* Modal CREATE MACHINE */}
      <section ref={refCreateSession}
        className='w-[60%] h-[80%] hidden flex-col gap-3 
        justify-center items-center absolute 
        bg-[#1c2833] text-white z-[99] rounded-md 
        mod-create-machine
        shadow-lg shadow-[#141414a9]'>
        <span className="absolute top-2 right-2 cursor-pointer text-white"
          onClick={() => refCreateSession.current.style.display = "none"}>
          <Close />
        </span>

        <h2>você esta criando uma nova máquina!</h2>

        <span className='font-bold'>{currentNanoID}</span>

        <div className="flex flex-col justify-center items-center gap-6">
          <span>selecione o tipo da máquina</span>

          <div className="flex justify-center items-center gap-3">

            <span onClick={() => setMachineType("PC")} className={`flex ${machineType === 'PC' ? "w-[90px] h-[90px] shadow-lg shadow-[#14141440]"
              : "w-[60px] h-[60px]"} cursor-pointer bg-[#707070] border-[1px] border-[#e6e6e6] rounded-md justify-center items-center`}>
              <img src={ComputerIcon} alt="" className="h-[70%] object-cover" />
            </span>

            <span onClick={() => setMachineType("PS5")} className={`flex ${machineType === 'PS5' ? "w-[90px] h-[90px] shadow-lg shadow-[#14141440]"
              : "w-[60px] h-[60px]"}  
              cursor-pointer bg-[#b8d4ff] border-[1px] border-[#deebfe] rounded-md justify-center items-center`}>
              <img src={PS_logo} alt="" className="h-[70%] object-cover" />
            </span>

            <span onClick={() => setMachineType("XBOX")} className={`flex ${machineType === 'XBOX' ? "w-[90px] h-[90px] shadow-lg shadow-[#14141440]"
              : "w-[60px] h-[60px]"}  
              cursor-pointer bg-[#b8fff0] border-[1px] border-[#defefa] rounded-md justify-center items-center`}>
              <img src={Xbox_logo} alt="" className="h-[60%] object-cover" />
            </span>

          </div>

        </div>

        {
          !isLoading ?
            <button onClick={() => handleCreateMachine(
              stateAdmin.admin_id,
              machineType,
              currentNanoID,
              navigate,
              localSelected,
              setIsLoading)}
              className='w-[100px] h-[40px] bg-[#e6a429] 
          rounded-[10px] text-white font-bold'>
              Criar
            </button> :
            <div>
              <LoadingComp />
            </div>
        }

      </section>
    </div>
  );
}

export default PortalAdm;