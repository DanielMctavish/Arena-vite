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
import AlertModal from '../Alert/AlertModal';

function PortalAdm() {
  const navigate = useNavigate();
  const [locationList, setLocationList] = useState([])
  const [localSelected, setLocalId] = useState("")
  const [machines, setMachines] = useState([])
  const [currentSession, setCurrentSession] = useState({ name: "usuário" })
  const [currentNanoID, setCurrentNanoID] = useState('')
  const [machineType, setMachineType] = useState('PC')
  const [isLoading, setIsLoading] = useState(false)
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: '',
    message: ''
  });

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

  useEffect(() => {
    if (localSelected) {
      getMachinesByLocal();
    }
  }, [localSelected]);

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

  const getMachinesByLocal = async () => {
    const currentSession = JSON.parse(localStorage.getItem('arena-adm-login'));
    if (!currentSession) return;

    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/adm/all-machines`, {
        params: {
          adm_id: localSelected // usando o ID do local aqui
        },
        headers: {
          'Authorization': `Bearer ${currentSession.token}`
        }
      });

      // console.log("resposta de todas as máquinas -> ", response.data)

      // Ordenar as máquinas por posição
      const sortedMachines = response.data.sort((a, b) => a.position - b.position);
      setMachines(sortedMachines);
    } catch (error) {
      console.error('Erro ao buscar máquinas:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem("arena-adm-login");
        navigate("/adm-login");
      }
    }
  };

  const handleAddMachine = () => {
    if (!localSelected) {
      setAlertConfig({
        isOpen: true,
        title: 'Selecione um Local',
        message: 'É necessário selecionar um local para adicionar uma máquina.'
      });
      return;
    }
    
    handleInitializeCreateMachine(refCreateSession, setCurrentNanoID, generateCustomID);
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

        <div className='absolute flex flex-col gap-4 w-full max-h-[78vh] top-[16vh] 
        p-4 overflow-y-auto scrollbar scrollbar-thumb-[#18212f] scrollbar-track-gray-100'>
          
          <SelectLocation localList={locationList} setLocalId={setLocalId} />

          {localSelected && (
            <div className="flex flex-wrap gap-4 p-6 w-full max-h-[60vh]
            overflow-y-auto overflow-x-hidden rounded-xl
            bg-[#5e30ba1c] backdrop-blur-[6px] relative
            border border-white/10 shadow-lg">
              {machines.map((machine, i) => (
                <CardMachine key={machine.id} machine={machine} index={i} />
              ))}

              <div
                onClick={handleAddMachine}
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
          )}
        </div>
      </section>

      {/* Modal CREATE MACHINE */}
      <section ref={refCreateSession}
        className='fixed inset-0 hidden items-center justify-center 
        bg-black/50 backdrop-blur-sm z-[99]'>
        <div className='w-[500px] bg-[#1c2833] text-white rounded-xl 
        shadow-lg shadow-black/30 p-8 relative'>
          <button 
            onClick={() => refCreateSession.current.style.display = "none"}
            className="absolute top-4 right-4 text-white/60 hover:text-white
            transition-colors duration-200">
            <Close />
          </button>

          <div className="flex flex-col items-center gap-6">
            <h2 className="text-2xl font-bold">Nova Máquina</h2>
            <span className='font-mono bg-[#e6a429]/20 px-4 py-2 rounded-lg text-[#e6a429]'>
              {currentNanoID}
            </span>

            <div className="flex flex-col items-center gap-4 w-full">
              <h3 className="text-lg text-white/80">Selecione o tipo da máquina</h3>

              <div className="flex justify-center items-center gap-4">
                {[
                  { type: 'PC', icon: ComputerIcon, bg: 'bg-[#707070]' },
                  { type: 'PS5', icon: PS_logo, bg: 'bg-[#b8d4ff]' },
                  { type: 'XBOX', icon: Xbox_logo, bg: 'bg-[#b8fff0]' }
                ].map((item) => (
                  <button
                    key={item.type}
                    onClick={() => setMachineType(item.type)}
                    className={`${
                      machineType === item.type 
                        ? 'w-[90px] h-[90px] shadow-lg shadow-black/20' 
                        : 'w-[60px] h-[60px] opacity-60'
                    } ${item.bg} rounded-xl transition-all duration-300
                    hover:opacity-100 flex items-center justify-center`}
                  >
                    <img 
                      src={item.icon} 
                      alt={item.type} 
                      className="h-[70%] object-contain" 
                    />
                  </button>
                ))}
              </div>
            </div>

            {!isLoading ? (
              <button 
                onClick={() => handleCreateMachine(
                  stateAdmin.admin_id,
                  machineType,
                  currentNanoID,
                  navigate,
                  localSelected,
                  setIsLoading,
                  refCreateSession
                )}
                className='w-full py-3 bg-gradient-to-r from-[#e6a429] to-[#ffd700]
                rounded-lg text-white font-bold hover:opacity-90 
                transition-opacity duration-200 shadow-lg shadow-[#e6a429]/20'
              >
                Criar Máquina
              </button>
            ) : (
              <div className="flex items-center justify-center">
                <LoadingComp />
              </div>
            )}
          </div>
        </div>
      </section>

      <AlertModal 
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
        title={alertConfig.title}
        message={alertConfig.message}
      />
    </div>
  );
}

export default PortalAdm;