import { SecurityRounded } from "@mui/icons-material"
import { useRef } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const RegisterAdm = () => {

    const navigate = useNavigate();

    const refEmail = useRef()
    const refName = useRef()
    const refPassword = useRef()
    const refConfirmPassword = useRef()

    const handleNavigateRegisterMaster = async () => {

        if (!refEmail.current.value || !refPassword.current.value) {
            alert("Preencha todos os campos")
        } else if (refPassword.current.value !== refConfirmPassword.current.value) {
            alert("As senhas não conferem")
        }

        await axios.post(`${import.meta.env.VITE_APP_API_URL}/adm/create-account`, {
            email: refEmail.current.value,
            nome: refName.current.value,
            senha: refPassword.current.value,
            saldo: 0,
            avatar_url: ""
        }).then(response => {
            console.log(response.data)
            navigate("/adm-login")
        }).catch(err => {
            console.log('erro ao tentar criar adm: ', err.response)
        })
    }

    return (
        <div className="w-full h-[100vh] bg-zinc-900 flex flex-col gap-3 justify-center items-center text-white">
            <div className="flex gap-2 justify-center items-center">
                <h1 className="text-[22px]">Área segura</h1>
                <SecurityRounded />
            </div>
            <span>criação de um novo administrador</span>
            <input ref={refEmail} type="email" className="rounded-sm text-zinc-700 p-2" placeholder="email" />
            <input ref={refName} type="text" className="rounded-sm text-zinc-700 p-2" placeholder="nome" />
            <input ref={refPassword} type="password" className="rounded-sm text-zinc-700 p-2" placeholder="senha" />
            <input ref={refConfirmPassword} type="password" className="rounded-sm text-zinc-700 p-2" placeholder="confirmar senha" />

            <button onClick={handleNavigateRegisterMaster} className="mt-7">Registrar</button>
        </div>
    )
}


export default RegisterAdm