/* eslint-disable no-unreachable */
import axios from "axios"


export const handleGetMachineList = async (admin_id, setCardsMachines) => {
    const getAdmSession = await JSON.parse(localStorage.getItem('arena-adm-login'))

    const authorizationConfig = {
        headers: {
            'Authorization': `Bearer ${getAdmSession.token}`
        }
    };


    await axios.get(`${import.meta.env.VITE_APP_API_URL}/adm/all-machines?adm_id=${admin_id}`,
        authorizationConfig).then(res => {

            setCardsMachines(res.data)

        }).catch(err => {
            console.log('erro ao pegar lista de máquinas', err.response)
        })

}