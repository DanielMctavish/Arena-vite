import { Close } from "@mui/icons-material";
import axios from "axios"
import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { getAdmInfoByEmail } from "../Portal-ADM/functions/getAdmInfoByEmail";

function CreateClient() {
    const [files, setFiles] = useState([]);
    const [clientName, setClientName] = useState([])
    const [clientEmail, setclientEmail] = useState([])
    const [clientCpf, setclientCpf] = useState([])
    const [senha, setSenha] = useState([])
    const [confirmSenha, setConfirmSenha] = useState([])
    const [isCreating, setIsCreating] = useState(false)

    const refSpanMessage = useRef()


    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 1) {
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


    const handleCloseCurrentWindow = () => {
        const currentClientWindow = document.querySelector(".mod-add-client");
        currentClientWindow.style.display = "none";
        setFiles([])
    }

    const handleCreateClient = async () => {
        const getAdmSession = JSON.parse(localStorage.getItem("arena-adm-login"))
        setIsCreating(true)
        //validate fields and password

        if (senha !== confirmSenha) {
            refSpanMessage.current.innerHTML = "As senhas não coincidem"
            return null
        }
        // if (senha.length < 8) {
        //     refSpanMessage.current.innerHTML = "A senha deve conter no mínimo 8 caracteres"
        //     return null
        // }
        if (!clientName || !clientEmail || !clientCpf || !senha || !confirmSenha) {
            refSpanMessage.current.innerHTML = "necessário preencher todos os campos"
            return null
        }

        getAdmInfoByEmail(getAdmSession.email).then(async res => {
            const config = {
                headers: {
                    'Authorization': `Bearer ${getAdmSession.token}`
                }
            };

            try {
                const formData = new FormData()
                formData.append('arena-client-profile', files[0])

                // FIREBASE.....
                let currentUrlClientImage;
                await axios.post(`${import.meta.env.VITE_APP_API_URL}/client/upload-client-profile`, formData)
                    .then(response => {
                        console.log('response firebase ->', response.data);
                        currentUrlClientImage = response.data.currentImage
                    })

                await axios.post(`${import.meta.env.VITE_APP_API_URL}/client/create-client`, {
                    nome: clientName,
                    email: clientEmail,
                    saldo: 0,
                    cpf: clientCpf,
                    senha: senha,
                    avatar_url: currentUrlClientImage,
                    administrator_id: res.id,
                    isPlaying: false
                }, config).then(() => {
                    setIsCreating(false)
                    setFiles([])
                })
            } catch (error) {
                console.log('erro ao tentar criar client _>', error);
                setIsCreating(false)
            }

        })

    }

    if (isCreating) {

        return (
            <div className="w-[60%] h-[88%] flex flex-col
            bg-gradient-to-t from-[#3C4557] to-[#192234]  text-white rounded-md 
            justify-center items-center gap-6 relative
            shadow-lg shadow-[#0f0f0f4d] overflow-y-auto">
                <span>Criando Cliente, aguarde!</span>
            </div>
        )
    }

    const { getRootProps, getInputProps, isDragActive } = dropzone;
    return (
        <div className="w-[60%] h-[88%] flex flex-col
        bg-gradient-to-r from-[#3C4557] to-[#192234]  text-white rounded-md 
        justify-center items-center gap-6 relative
        shadow-lg shadow-[#0f0f0f4d] overflow-y-auto">

            <span onClick={handleCloseCurrentWindow} className="absolute top-1 right-1 text-zinc-100 cursor-pointer">
                <Close />
            </span>

            {/* DRAG AND DROP AREA */}
            <div
                {...getRootProps({ className: "dropzone" })}
                className="flex w-[200px] h-[200px] border-[2px] border-white 
                border-dashed justify-center items-center text-[12px]
                rounded-full relative overflow-hidden">
                {
                    isDragActive ?
                        <span ref={refSpanMessage}>solte a foto!</span> :
                        <span ref={refSpanMessage}>clique ou arraste</span>
                }
                <input {...getInputProps()} type="file" className="hidden" />
                {
                    files[0] ?
                        (<img src={URL.createObjectURL(files[0])} alt={files[0].name}
                            className="absolute flex h-[100%] object-cover z-[99] rounded-md" />) : ""
                }
            </div>

            <input onChange={(e) => { setClientName(e.target.value) }}
                type="text" className="p-2 border-[1px] bg-transparent rounded-md w-[80%]"
                placeholder="nome do cliente" />
            <input onChange={(e) => { setclientEmail(e.target.value) }} type="text" className="p-2 border-[1px] bg-transparent rounded-md w-[80%]" placeholder="email do cliente" />
            <input onChange={(e) => { setclientCpf(e.target.value) }} type="text" className="p-2 border-[1px] bg-transparent rounded-md w-[80%]" placeholder="cpf do cliente" />
            <input onChange={(e) => { setSenha(e.target.value) }} type="password" className="p-2 border-[1px] bg-transparent rounded-md w-[80%]" placeholder="senha" />
            <input onChange={(e) => { setConfirmSenha(e.target.value) }} type="password" className="p-2 border-[1px] bg-transparent rounded-md w-[80%]" placeholder="confirmar senha" />

            <button
                onClick={handleCreateClient}
                className="p-2 bg-[#27314b] border-[1px] border-[#3e4e75] rounded-md w-[80%]">
                criar cliente
            </button>
        </div>
    )
}

export default CreateClient;