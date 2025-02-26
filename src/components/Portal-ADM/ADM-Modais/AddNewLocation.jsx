import axios from "axios";
import React, { useEffect, useState } from "react";


function AddNewLocation() {
    const [isLoading, setIsLoading] = useState(false)
    const [localName, setLocalName] = useState("")
    const [address, setAddress] = useState("");
    const [allAdmins, setAdmins] = useState([])
    const [adminSelected, setAdminSelected] = useState({})

    useEffect(() => {
        getAllAdmins()
    }, [])

    function closePanelLocation() {
        const currentPanel = document.querySelector(".painel-local");
        currentPanel.style.display = "none";
    }

    function handleAddressChange(event) {
        setAddress(event.target.value);
    }

    const handleSelectAdmin = (e) => {
        console.log("selecionou este -> ", e.target.value)
        setAdminSelected(e.target.value)
    }

    const getAllAdmins = async () => {
        const getAdmSession = JSON.parse(localStorage.getItem("arena-adm-login"))

        await axios.get(`${import.meta.env.VITE_APP_API_URL}/adm/all-admins`, {
            headers: {
                'Authorization': `Bearer ${getAdmSession.token}`
            }
        }).then(response => {
            //console.log("all admins -> ", response.data)
            setAdmins(response.data)
        }).catch(error => {
            console.log("error -> ", error.message)
        })

    }

    const handleCreateLocal = async () => {
        const currentSession = JSON.parse(localStorage.getItem("arena-adm-login"));
        const currentPainel = document.querySelector(".painel-local")
        setIsLoading(true)

        await axios.post(`${import.meta.env.VITE_APP_API_URL}/adm/create-local`, {
            nome: localName,
            end_url_google: address,
            userAdmId: adminSelected
        }, {
            headers: {
                'Authorization': `Bearer ${currentSession.token}`
            }
        }).then(response => {

            console.log("resultado, criação de local -> ", response.data)
            currentPainel.style.display = "none";
            setIsLoading(false)

        }).catch(Error => {

            setIsLoading(false)
            currentPainel.style.display = "none";
            console.log("erro ao criar local -> ", Error.message)

        })

    }

    if (isLoading) {
        return (
            <div className="painel-local fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-[#273249] p-8 rounded-lg shadow-xl border border-[#8FA5CF] flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                    <p className="mt-4 text-white font-medium">Criando local...</p>
                </div>
            </div>
        )
    }


    return (
        <div className="painel-local fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="relative bg-[#273249] p-8 rounded-lg shadow-xl border border-[#8FA5CF] w-[503px] flex flex-col gap-6">
                {/* Botão de fechar */}
                <button
                    onClick={closePanelLocation}
                    className="absolute right-4 top-4 w-8 h-8 rounded-full bg-gradient-to-r from-red-600 to-red-400 
                    border-2 border-white hover:opacity-80 transition-opacity flex items-center justify-center"
                >
                    <span className="text-white text-xl">&times;</span>
                </button>

                {/* Título */}
                <h2 className="text-2xl font-bold text-center text-white mb-6">
                    Registrar Local
                </h2>

                {/* Formulário */}
                <div className="flex flex-col gap-4">
                    <select
                        onChange={handleSelectAdmin}
                        className="w-full px-4 py-2 bg-white bg-opacity-95 text-gray-700 rounded-lg 
                        border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 
                        transition-all duration-200"
                    >
                        <option value="select">Selecione o proprietário</option>
                        {allAdmins.map((admin, i) => (
                            <option key={i} value={admin.id}>{admin.nome}</option>
                        ))}
                    </select>

                    <input
                        type="text"
                        placeholder="Nome do local"
                        className="w-full px-4 py-2 bg-white bg-opacity-95 text-gray-700 rounded-lg 
                        border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 
                        transition-all duration-200"
                        onChange={(e) => setLocalName(e.target.value)}
                    />

                    <input
                        type="text"
                        placeholder="Digite o endereço"
                        value={address}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-2 bg-white bg-opacity-95 text-gray-700 rounded-lg 
                        border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 
                        transition-all duration-200"
                    />

                    <button 
                        onClick={handleCreateLocal}
                        className="w-full mt-4 py-3 bg-gradient-to-r from-blue-600 to-blue-400 
                        text-white font-medium rounded-lg hover:opacity-90 transition-opacity
                        transform hover:scale-[1.02] duration-200"
                    >
                        Registrar Local
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddNewLocation;
