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
            <div className="painel-local absolute text-white font-bold w-[503px] h-[765px] bg-[#273249] rounded-[10px] border-[1px] border-[#8FA5CF] hidden flex-col justify-around items-center z-50">
                criando local...
            </div>
        )
    }


    return (

        <div className="painel-local absolute text-white font-bold w-[503px] h-[765px] bg-[#273249] rounded-[10px] border-[1px] border-[#8FA5CF] hidden flex-col justify-around items-center z-50">
            <span
                onClick={closePanelLocation}
                className="absolute right-2 top-2 cursor-pointer w-[26px] h-[26px] rounded-full bg-gradient-to-r from-[#FF0000] to-[#fe5b5b] border-[2px] border-white"
            ></span>
            <h2>REGISTRAR LOCAL</h2>

            <select
                onChange={handleSelectAdmin}
                className="w-[210px] h-[30px] bg-[#F5F5F5] text-zinc-600 text-center rounded-[4px]"
            >
                <option value="select">Selecione o proprietário</option>
                {
                    allAdmins.map((admin, i) => (
                        <option key={i} value={admin.id}>{admin.nome}</option>
                    ))
                }
            </select>

            <input
                type="text"
                placeholder="Nome do local"
                className="w-[210px] h-[30px] bg-[#F5F5F5] text-zinc-600 text-center rounded-[4px]"
                onChange={(e) => setLocalName(e.target.value)}
            />

            <input
                type="text"
                placeholder="Digite o endereço"
                value={address}
                onChange={handleAddressChange}
                className="w-[210px] h-[30px] bg-[#F5F5F5] text-zinc-600 text-center rounded-[4px]"
            />

            <button onClick={handleCreateLocal}>registrar local</button>
        </div>

    );
}

export default AddNewLocation;
