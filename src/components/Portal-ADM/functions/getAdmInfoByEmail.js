import axios from "axios"


export const getAdmInfoByEmail = async (email, configAuthorization, dispatch, updateError, updateAdmin) => {

    if (email) {
        await axios.get(`${import.meta.env.VITE_APP_API_URL}/adm/admin-info-email?email=${email}`, configAuthorization)
            .then(response => {
                //console.log('observando adm -> ', response.data);
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