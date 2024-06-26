/* eslint-disable no-unreachable */
/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BgAdm from '../../medias/bg-adm.png';
import "./styles/PortalAdm.css"

import CardMachine from './ADM-components/CardMachine';
import NavigationAdm from '../navigation/Navigation';
import Asside from '../Asside/Asside';
import SelectLocation from './ADM-components/SelectLocation';

import { Add } from '@mui/icons-material'
import ModalConfigSession from './ADM-Modais/ModalConfigSession';
import SureMachineDelete from './ADM-Modais/SureMachineDelete';
import { generateCustomID } from './functions/generateCustomID';
import { handleInitializeCreateMachine } from './functions/handleInitializeCreateMachine';
import { handleCreateMachine } from './functions/handleCreateMachine';
import { getAdmInfoByEmail } from './functions/getAdmInfoByEmail';
import { handleGetMachineList } from './functions/handleGetMachineList';

import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import { updateError } from '../../redux/access/ErrorSlice';
import { updateAdmin } from '../../redux/admin/AdminSlice';

import { connectWebSocket } from "../SocketCOM/connectWebSocket";

function PortalAdm() {
  const navigate = useNavigate();

  const [locationList, setLocationList] = useState([])
  const [localSelected, setLocalId] = useState("")
  const [currentSession, setCurrentSession] = useState({ name: "usuário" })
  const [currentNanoID, setCurrentNanoID] = useState('')
  const [cardsMachines, setCardsMachines] = useState([])
  const [socket, setSocket] = useState()

  const refCreateSession = useRef()
  const dispatch = useDispatch()
  const stateError = useSelector(state => state.error_status)
  const stateAdmin = useSelector(state => state.admin)
  const stateMachine = useSelector(state => state.machine)


  useEffect(() => {

    const currentSocket = connectWebSocket()
    setSocket(currentSocket);

    getLocationList()

  }, []);

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

  useEffect(() => {
    //console.log('observando stateAdmin ->', stateAdmin.admin_id);
    handleGetMachineList(stateAdmin.admin_id, setCardsMachines)

  }, [stateAdmin])



  //-----------------------------------------------------------------------------------------------

  const getLocationList = async () => {

    try {
      const currentSession = JSON.parse(localStorage.getItem('arena-adm-login'));

      await axios.get(`${import.meta.env.VITE_APP_API_URL}/adm/admin-info-email?email=${currentSession.email}`, {
        headers: {
          'Authorization': `Bearer ${currentSession.token}`
        }
      }).then((response) => {
        console.log(response.data.ArenaLocal)
        setLocationList(response.data.ArenaLocal)
      })

      // await axios.get(`${import.meta.env.VITE_APP_API_URL}/adm/all-machines?adm_id=${}`)
      //   .then(response => {
      //     console.log("all machines -> ", response.data)
      //     setCardsMachines(response.data)
      //   })

    } catch (error) {
      console.log(error.message)
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
      border-[#e6a429] relative overflow-hidden"
    >

      {/* -------------------------------- Modal CREATE MACHINE -------------------------------- */}
      <section ref={refCreateSession}
        className='w-[80%] h-[80%] hidden flex-col gap-3 
      justify-center items-center absolute 
      bg-white z-[99] rounded-md 
      mod-create-machine
      shadow-lg shadow-[#141414a9]'>
        <h2>você esta criando uma nova máquina!</h2>

        <span className='font-bold'>{currentNanoID}</span>

        <button onClick={() => handleCreateMachine(
          stateAdmin.admin_id,
          currentNanoID,
          handleGetMachineList,
          setCardsMachines,
          navigate,
          localSelected)} className='w-[100px] h-[40px] bg-[#e6a429] rounded-[10px] text-white font-bold'>Criar</button>

      </section>
      {/* ---------------------------------------------------------------------------------------- */}

      <Asside />
      <NavigationAdm title="SESSÕES" adm_id={stateAdmin.admin_id} />
      <ModalConfigSession />
      <SureMachineDelete />
      <SelectLocation localList={locationList} setLocalId={setLocalId} />

      <section className='absolute flex flex-wrap 
      justify-start items-start 
      gap-3 sm:w-[70%] w-[94%] 
      sm:max-h-[78vh] max-h-[82vh] 
      sm:right-[3vh] right-auto top-[16vh] 
      p-3 overflow-y-auto scrollbar 
      scrollbar-thumb-[#18212f] scrollbar-track-gray-100'>

        {
          Array.isArray(cardsMachines) &&
          cardsMachines.map((machine, i) => (
            <div key={i}>
              <CardMachine machine={machine} socket={socket} index={i} />
            </div>
          ))
        }

        <div
          onClick={() => handleInitializeCreateMachine(refCreateSession, setCurrentNanoID, generateCustomID)}
          className="add-machine w-[160px] h-[233px] bg-[#1f2735] hover:bg-[#18212f] 
          cursor-pointer border-[1px] border-[#8499c2] rounded-[10px] 
          flex flex-col justify-center items-center text-white">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <Add />
        </div>

      </section>

    </div>
  );
}

export default PortalAdm;