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

        await axios.post(`${import.meta.env.VITE_APP_API_URL}/adm/create-machine`, {
            nano_id: currentNanoID,
            userAdmId: currentAdmID,
            arenaLocalId: "cltt03yy40000vzg8fl8hln00",
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