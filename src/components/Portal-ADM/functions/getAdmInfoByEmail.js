/* eslint-disable no-unreachable */
import axios from "axios"


export const getAdmInfoByEmail = async (email, dispatch, updateError, updateAdmin) => {

    const getAdmSession = await JSON.parse(localStorage.getItem("arena-adm-login"))
    if (!getAdmSession) return null
    const config = {
        headers: {
            'Authorization': `Bearer ${getAdmSession.token}`
        }
    };

    return new Promise(async (resolve, reject) => {

        try {
            if (email) {
                await axios.get(`${import.meta.env.VITE_APP_API_URL}/adm/admin-info-email?email=${email}`, config)
                    .then(response => {
                        resolve(response.data)
                        if (dispatch)
                            dispatch(updateAdmin({ admin_id: response.data.id }))
                    })
            }
        } catch (error) {

            reject({ error: error.message })
            if (error.message) {
                dispatch(updateError(500))
            }
            if (error.response)
                dispatch(updateError(error.response.status))

        }

    })

}