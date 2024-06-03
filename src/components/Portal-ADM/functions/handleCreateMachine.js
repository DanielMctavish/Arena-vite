/* eslint-disable no-unreachable */
import axios from "axios"

export const handleCreateMachine = async (
    currentAdmID,
    currentNanoID,
    handleGetMachineList,
    setCardsMachines,
    navigate) => {

    const modCreateMachine = document.querySelector(".mod-create-machine")
    modCreateMachine.style.display = 'none'

    try {
        const getAdmSession = await JSON.parse(localStorage.getItem("arena-adm-login"))
        const config = {
            headers: {
                'Authorization': `Bearer ${getAdmSession.token}`
            }
        };

        const currentAdmInfo = await axios.get(`${import.meta.env.VITE_APP_API_URL}/adm/admin-info?adm_id=${currentAdmID}`, config);

        await axios.post(`${import.meta.env.VITE_APP_API_URL}/adm/create-machine`, {
            nano_id: currentNanoID,
            userAdmId: currentAdmID,
            arenaLocalId: currentAdmInfo.data.ArenaLocal[0].id,
            status: 'DESCONECTED'
        }, config).then(response => {
            //console.log('observando create machine -> ', response.data)
            handleGetMachineList(currentAdmID, setCardsMachines)
        })

    } catch (err) {
        console.log('erro ao criar máquina --> ', err.message, currentAdmID, currentNanoID)
        if (err.response.status === 401) {
            localStorage.removeItem('arena-adm-login')
            navigate("/adm-login")
        }
        modCreateMachine.style.display = 'none'
    }

}