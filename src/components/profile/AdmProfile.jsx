import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import Asside from "../Asside/Asside";
import NavigationAdm from "../navigation/Navigation";
import BgAdm from '../../medias/bg-adm.png';


function AdmProfile() {
    const [currentSession, setCurrentSession] = useState({ name: "usuário" })
    const [files, setFiles] = useState([]);
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [isLoading, setIsLoading] = useState(false)

    const refSpanMessage = useRef()

    useEffect(() => {
        const currentSession = JSON.parse(localStorage.getItem("arena-adm-login"))
        //console.log('observando sessão atual >>>> ', currentSession);
        setCurrentSession(currentSession)
    }, [])

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 1) {
            refSpanMessage.current.style.display = "flex";
            refSpanMessage.current.innerHTML = "só é possível importar apenas uma imagem..."
            return null
        }

        setFiles(acceptedFiles)
    }, []);

    const dropzone = useDropzone({
        onDrop,
        accept: {
            'image/png': ['.png'],
            'image/jpeg': ['.jpg'],
            'image/jpg': ['.jpg'],
            'image/gif': ['.gif'],
        }
    });

    const handleEditAdministrator = async () => {

        if (password !== confirmPassword) {
            refSpanMessage.current.style.display = "flex";
            refSpanMessage.current.innerHTML = "as senhas não coincidem..."
            return null
        }
        if (!files[0]) {
            refSpanMessage.current.style.display = "flex";
            refSpanMessage.current.innerHTML = "necessário enviar uma imagem"
            return null
        }

        setIsLoading(true)

        const getAdmSession = await JSON.parse(localStorage.getItem("arena-adm-login"))
        const config = {
            headers: {
                'Authorization': `Bearer ${getAdmSession.token}`
            }
        };

        const formData = new FormData()
        formData.append('arena-adm-profile', files[0])

        try {
            //get Admin informations

            const currentAdministrator =
                await axios.get(`${import.meta.env.VITE_APP_API_URL}/adm/admin-info-email?email=${getAdmSession.email}`, config)

            // FIREBASE.....
            //delete current photo
            if (currentAdministrator.data.avatar_url)
                await axios.delete(`${import.meta.env.VITE_APP_API_URL}/adm/delete-admin-profile?url=${currentAdministrator.data.avatar_url}&admin_id=${currentAdministrator.data.id}`, formData)

            //add photo
            let currentUrlAdm;
            await axios.post(`${import.meta.env.VITE_APP_API_URL}/adm/upload-admin-profile?adm_id=${currentAdministrator.data.id}`, formData)
                .then(response => {
                    console.log('response firebase ->', response.data);
                    currentUrlAdm = response.data.currentImage
                })
            // ...............................................................................................................

            await axios.patch(`${import.meta.env.VITE_APP_API_URL}/adm/update-administrator`, {
                email: email,
                nome: name,
                senha: password,
                avatar_url: !currentUrlAdm ? currentAdministrator.data.avatar_url : currentUrlAdm
            }, config).then(response => {
                console.log('dados >> ', email, name, password);
                console.log('adm alterado -> ', response.data);
                setIsLoading(false)
            })

        } catch (error) {
            console.log('error ao tentar alterar adm -> ', error.message);
            setIsLoading(false)
        }

    }


    const { getRootProps, getInputProps, isDragActive } = dropzone;

    if (isLoading) {

        return (
            <div style={{
                backgroundImage: `url(${BgAdm})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
                className="bg-zinc-800 w-full h-[100vh] 
            flex justify-center items-center border-[10px] 
             border-[#e6a429] relative overflow-hidden text-white">editando administrador, aguarde...</div>
        )
    }

    return (
        <div
            style={{
                backgroundImage: `url(${BgAdm})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
            className="bg-zinc-800 w-full h-[100vh] 
            flex justify-center items-center border-[10px] 
             border-[#e6a429] relative overflow-hidden"
        >
            <Asside />
            <NavigationAdm title="PERFIL CONFIG" name={currentSession.name} />

            <section className='absolute flex flex-wrap 
                    justify-start items-start 
                    sm:w-[70%] w-[94%] 
                    h-[82vh]
                    sm:right-[3vh] right-auto top-[14vh] 
                    p-3 overflow-y-auto scrollbar 
                    scrollbar-thumb-[#18212f] scrollbar-track-gray-100'>

                <div className="flex flex-col justify-start items-center w-[300px] h-[100%] bg-[#aad0fc30] 
                rounded-md p-[2vh] gap-[1vh] relative overflow-hidden backdrop-blur-md text-white">
                    {/* span errors messages */}
                    <span
                        ref={refSpanMessage}
                        className="w-full bg-red-600 text-white absolute top-0 p-2 hidden">mensagem</span>
                    {/* foto do perfil */}
                    <div
                        {...getRootProps({ className: "dropzone" })}
                        className="flex w-[120px] h-[120px] border-[2px] border-[#c7c7c7] 
                        border-dashed justify-center items-center text-[12px]
                        rounded-full relative overflow-hidden cursor-pointer mt-[3vh]">
                        {
                            isDragActive ?
                                <span>solte a foto!</span> :
                                <span>clique ou arraste</span>
                        }
                        <input {...getInputProps()} type="file" className="hidden" />
                        {
                            files[0] ?
                                (<img src={URL.createObjectURL(files[0])} alt={files[0].name}
                                    className="absolute flex w-full object-cover z-[99] rounded-md" />) : ""
                        }
                    </div>
                    {/* ********************* */}

                    <input onChange={(e) => { setName(e.target.value) }}
                        type="text" className="p-2 border-[1px] bg-transparent rounded-md w-[80%] mt-[4vh]" placeholder="nome" />
                    <input onChange={(e) => { setEmail(e.target.value) }}
                        type="text" className="p-2 border-[1px] bg-transparent rounded-md w-[80%]" placeholder="email" />
                    <input onChange={(e) => { setPassword(e.target.value) }}
                        type="password" className="p-2 border-[1px] bg-transparent rounded-md w-[80%]" placeholder="senha" />
                    <input onChange={(e) => { setConfirmPassword(e.target.value) }}
                        type="password" className="p-2 border-[1px] bg-transparent rounded-md w-[80%]" placeholder="confirmar senha" />

                    <button
                        onClick={handleEditAdministrator}
                        className="p-2 bg-[#27314b] text-white border-[1px] border-[#3e4e75] rounded-md w-[80%]">
                        alterar administrador
                    </button>
                </div>

            </section>

        </div>
    )

}


export default AdmProfile;