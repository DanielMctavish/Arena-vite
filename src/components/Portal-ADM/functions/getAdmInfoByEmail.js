import axios from "axios"


export const getAdmInfoByEmail = async (email, configAuthorization, setCurrentAdmID) => {

    return new Promise(async (resolve, reject) => {

        await axios.get(`${import.meta.env.VITE_APP_API_URL}/adm/admin-info-email?email=${email}`, configAuthorization)
            .then(response => {

                console.log('observando adm -> ', response.data);
                setCurrentAdmID(response.data.id)
                resolve(response.data)

            }).catch(err => {
                reject(err.response)
            })

    })

}