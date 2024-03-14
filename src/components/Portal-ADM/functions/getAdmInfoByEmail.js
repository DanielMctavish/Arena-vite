/* eslint-disable no-unreachable */
import axios from "axios"


export const getAdmInfoByEmail = async (email, dispatch, updateError, updateAdmin) => {

    const getAdmSession =await JSON.parse(localStorage.getItem("arena-adm-login"))
    const config = {
      headers: {
        'Authorization': `Bearer ${getAdmSession.token}`
      }
    };

    if (email) {
        await axios.get(`${import.meta.env.VITE_APP_API_URL}/adm/admin-info-email?email=${email}`, config)
            .then(response => {
                
                dispatch(updateAdmin({ admin_id: response.data.id }))

            }).catch(err => {
                console.log('erro ao pegar adm pelo email -> ', err);
                if(err.message){
                    dispatch(updateError(500))
                }
                if (err.response)
                    dispatch(updateError(err.response.status))
            })
    }

}