import { Close } from "@mui/icons-material";
import axios from "axios"
import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { getAdmInfoByEmail } from "../Portal-ADM/functions/getAdmInfoByEmail";

function CreateClient() {
    const [files, setFiles] = useState([]);
    const [clientName, setClientName] = useState('')
    const [clientEmail, setclientEmail] = useState('')
    const [clientCpf, setclientCpf] = useState('')
    const [address, setAdress] = useState('')
    const [phone, setPhone] = useState('')
    const [senha, setSenha] = useState([])
    const [confirmSenha, setConfirmSenha] = useState([])
    const [isCreating, setIsCreating] = useState(false)

    const refSpanMessage = useRef()
    const refSpanCreation = useRef()


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

        //validate fields and password
        if (!clientName || !clientEmail || !clientCpf || !senha || !confirmSenha || !address || !phone) {
            refSpanCreation.current.style.display = "block"
            refSpanCreation.current.innerHTML = "necessário preencher todos os campos"
            setTimeout(() => {
                refSpanCreation.current.style.display = "none"
            }, 3000);
            return null
        }

        if (senha !== confirmSenha) {
            refSpanCreation.current.style.display = "block"
            refSpanCreation.current.innerHTML = "As senhas não coincidem"
            setTimeout(() => {
                refSpanCreation.current.style.display = "none"
            }, 3000);
            return null
        }

        if (senha.length < 6) {
            refSpanCreation.current.style.display = "block"
            refSpanCreation.current.innerHTML = "A senha deve conter no mínimo 6 caracteres"
            setTimeout(() => {
                refSpanCreation.current.style.display = "none"
            }, 3000);
            return null
        }

        if (files.length === 0) {
            refSpanCreation.current.style.display = "block"
            refSpanCreation.current.innerHTML = "Adicione uma foto pro usuário"
            setTimeout(() => {
                refSpanCreation.current.style.display = "none"
            }, 3000);
            return null
        }

        setIsCreating(true)

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
                    horas: 0,
                    cpf: clientCpf,
                    senha: senha,
                    tel: phone,
                    address: address,
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
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="w-[500px] bg-[#18212f] rounded-lg shadow-xl border border-purple-500/20 
                p-8 flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
                    <span className="mt-4 text-gray-300">Criando Cliente, aguarde!</span>
                </div>
            </div>
        )
    }

    const { getRootProps, getInputProps, isDragActive } = dropzone;
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="w-[600px] bg-[#18212f] rounded-lg shadow-xl border border-purple-500/20 
            overflow-hidden transform transition-all">
                {/* Header */}
                <div className="relative h-24 bg-gradient-to-r from-purple-600 to-blue-600">
                    <button 
                        onClick={handleCloseCurrentWindow}
                        className="absolute top-2 right-2 text-white/80 hover:text-white 
                        transition-colors p-1 hover:bg-white/10 rounded-full"
                    >
                        <Close />
                    </button>
                    <h2 className="absolute bottom-4 left-4 text-2xl font-bold text-white">
                        Novo Cliente
                    </h2>
                </div>

                <div className="p-6">
                    <span ref={refSpanCreation} className="hidden bg-yellow-500/90 text-white p-3 rounded-md 
                    mb-4 block text-center">
                        span de criação
                    </span>

                    {/* Área de Upload */}
                    <div className="flex justify-center mb-6">
                        <div
                            {...getRootProps()}
                            className="w-32 h-32 rounded-full border-2 border-purple-500/50 border-dashed
                            flex items-center justify-center cursor-pointer hover:border-purple-500
                            transition-colors relative overflow-hidden"
                        >
                            <input {...getInputProps()} />
                            {files[0] ? (
                                <img 
                                    src={URL.createObjectURL(files[0])} 
                                    alt="Preview" 
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            ) : (
                                <span ref={refSpanMessage} className="text-gray-400 text-sm text-center">
                                    {isDragActive ? "Solte a foto!" : "Clique ou arraste\numa foto"}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Formulário */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4">
                            <input 
                                type="text"
                                placeholder="Nome do cliente"
                                onChange={(e) => setClientName(e.target.value)}
                                className="w-full bg-[#1f2937] border border-purple-500/20 rounded-md
                                p-2.5 text-gray-300 focus:border-purple-500 transition-colors
                                outline-none"
                            />
                            <input 
                                type="email"
                                placeholder="Email do cliente"
                                onChange={(e) => setclientEmail(e.target.value)}
                                className="w-full bg-[#1f2937] border border-purple-500/20 rounded-md
                                p-2.5 text-gray-300 focus:border-purple-500 transition-colors
                                outline-none"
                            />
                            <input 
                                type="text"
                                placeholder="CPF do cliente"
                                onChange={(e) => setclientCpf(e.target.value)}
                                className="w-full bg-[#1f2937] border border-purple-500/20 rounded-md
                                p-2.5 text-gray-300 focus:border-purple-500 transition-colors
                                outline-none"
                            />
                        </div>

                        <div className="space-y-4">
                            <input 
                                type="text"
                                placeholder="Endereço"
                                onChange={(e) => setAdress(e.target.value)}
                                className="w-full bg-[#1f2937] border border-purple-500/20 rounded-md
                                p-2.5 text-gray-300 focus:border-purple-500 transition-colors
                                outline-none"
                            />
                            <input 
                                type="text"
                                placeholder="Telefone"
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full bg-[#1f2937] border border-purple-500/20 rounded-md
                                p-2.5 text-gray-300 focus:border-purple-500 transition-colors
                                outline-none"
                            />
                            <input 
                                type="password"
                                placeholder="Senha"
                                onChange={(e) => setSenha(e.target.value)}
                                className="w-full bg-[#1f2937] border border-purple-500/20 rounded-md
                                p-2.5 text-gray-300 focus:border-purple-500 transition-colors
                                outline-none"
                            />
                            <input 
                                type="password"
                                placeholder="Confirmar senha"
                                onChange={(e) => setConfirmSenha(e.target.value)}
                                className="w-full bg-[#1f2937] border border-purple-500/20 rounded-md
                                p-2.5 text-gray-300 focus:border-purple-500 transition-colors
                                outline-none"
                            />
                        </div>
                    </div>

                    {/* Botão de Criar */}
                    <button
                        onClick={handleCreateClient}
                        className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600
                        text-white py-2.5 rounded-md hover:opacity-90 transition-opacity
                        font-medium"
                    >
                        Criar Cliente
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CreateClient;