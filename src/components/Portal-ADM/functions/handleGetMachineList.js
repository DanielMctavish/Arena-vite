import axios from "axios"


export const handleGetMachineList = async (getAdmInfoByEmail, setCardsMachines) => {
    const getAdmSession = await JSON.parse(localStorage.getItem('arena-adm-login'))

    const authorizationConfig = {
        headers: {
            'Authorization': `Bearer ${getAdmSession.token}`
        }
    };

    await getAdmInfoByEmail(getAdmSession.email, authorizationConfig).then(async response => {

        await axios.get(`${import.meta.env.VITE_APP_API_URL}/adm/all-machines?adm_id=${response.id}`,
            authorizationConfig).then(res => {

                console.log('lista de máquinas resposta:(auto) ', res.data)
                setCardsMachines(res.data)

            }).catch(err => {
                console.log('erro ao pegar lista de máquinas', err.response)
            })

    }).catch(err => {
        console.log('erro ao pegar lista de máquinas (auto)', err)
    })

}