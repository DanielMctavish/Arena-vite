import axios from "axios"

export const handleCreateMachine = async (
    currentAdmID,
    getAdmInfoByEmail,
    currentSession,
    config,
    currentNanoID,
    refCreateSession,
    handleGetMachineList,
    setCardsMachines,
    navigate) => {

    //getAdminformations...................................................

    getAdmInfoByEmail(currentSession.email, config)

    //create machine operation.............................................

    await axios.post(`${import.meta.env.VITE_APP_API_URL}/adm/create-machine`, {
        nano_id: currentNanoID,
        userAdmId: currentAdmID,
        arenaLocalId: "cls4u5ngr0001vj54z40wkc4l"
    }, config).then(response => {

        //console.log('observando create machine -> ', response.data)
        refCreateSession.current.style.display = 'none'
        handleGetMachineList(currentAdmID, setCardsMachines)

    }).catch(err => {

        console.log('erro ao criar máquina --> ', err.response)
        if (err.response.status === 401) {
            localStorage.removeItem('arena-adm-login')
            navigate("/adm-login")
        }
        refCreateSession.current.style.display = 'none'

    })

}