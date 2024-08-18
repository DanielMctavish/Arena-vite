/* eslint-disable no-unreachable */
import axios from "axios"

export const handleCreateMachine = async (
    currentAdmID,
    machineType,
    currentNanoID,
    navigate,
    localSelected,
    setIsLoading) => {

    console.log("observando local id -> ", localSelected)

    const modCreateMachine = document.querySelector(".mod-create-machine")
    modCreateMachine.style.display = 'none'

    try {
        const getAdmSession = await JSON.parse(localStorage.getItem("arena-adm-login"))
        const config = {
            headers: {
                'Authorization': `Bearer ${getAdmSession.token}`
            }
        };

        //const currentAdmInfo = await axios.get(`${import.meta.env.VITE_APP_API_URL}/adm/admin-info?adm_id=${currentAdmID}`, config);

        setIsLoading(true)

        await axios.post(`${import.meta.env.VITE_APP_API_URL}/adm/create-machine`, {
            nano_id: currentNanoID,
            type: machineType,
            userAdmId: currentAdmID,
            arenaLocalId: localSelected,
            connection: 'DISCONECTED',
            status: 'STOPED'
        }, config).then(response => {
            //console.log('observando create machine -> ', response.data)
            setIsLoading(false)
        })

    } catch (err) {
        console.log('erro ao criar máquina --> ', err.message, currentAdmID, currentNanoID)
        if (err.response.status === 401) {
            localStorage.removeItem('arena-adm-login')
            navigate("/adm-login")
        }
        setIsLoading(false)
        modCreateMachine.style.display = 'none'
    }

}