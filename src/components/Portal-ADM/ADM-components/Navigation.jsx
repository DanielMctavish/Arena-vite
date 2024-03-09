import React, { useEffect, useRef, useState } from "react";
import Richard from "../../../medias/avatares/richard.png"
import ComputerIcon from "../../../medias/icons/iMac.png"
import { useNavigate } from "react-router-dom"

function NavigationAdm(props) {
    const [dateFormated, setDateFormated] = useState('data');

    const navigate = useNavigate()

    function dateNowFormated() {
        // Obter a data atual
        var dataAtual = new Date();

        // Obter o dia
        var dia = dataAtual.getDate();

        // Obter o mês
        var meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
        var mes = meses[dataAtual.getMonth()];

        // Obter a hora e os minutos
        var hora = dataAtual.getHours();
        var minutos = dataAtual.getMinutes();

        // Formatar a data no formato desejado
        var dataFormatada = dia + ' de ' + mes + ' ' + hora + ':' + minutos;

        setDateFormated(dataFormatada)
    }

    useEffect(() => {
        dateNowFormated()
    }, [])

    const refSubMenu = useRef()

    const showSubMenu = () => {
        //console.log('clickou');
        refSubMenu.current.style.display = "flex"
    }

    const handleRedirectProfilePage = () => {

    }

    const handleLogoutCurrentSession = () => {
        localStorage.removeItem("arena-adm-login")
        navigate("/")
    }

    return (
        <nav
            className='
        absolute
        p-6
        flex
        justify-between
        items-center 
        top-[2vh] 
        sm:right-[3vh] 
        right-auto 
        sm:w-[72%] 
        w-[94%] 
        h-[78px] 
        bg-gradient-to-r 
        from-[#3E4759] 
        to-[#1D2433] 
        rounded-[10px] 
        border-[1px]
        text-white 
        text-[14px]
        border-[#535E74]'>

            <div className="flex justify-center items-center gap-3">
                <img src={ComputerIcon} alt="icone computador" className="w-[30px] h-[30px]" />
                <span className="text-[18px]">{props.title}</span>
            </div>

            <span className="absolute left-[46%] sm:block hidden">
                {dateFormated}
            </span>

            <div onClick={showSubMenu} className="flex justify-center items-center gap-3 cursor-pointer">
                <img src={Richard} alt="avatar" className="rounded-full bg-slate-200 w-[46px] h-[46px]" />
                <span className="sm:block hidden">{props.name}</span>
            </div>

            <div
                ref={refSubMenu}
                className="w-[200px] bg-white 
            hidden flex-col justify-start items-center p-2 
            absolute right-0 top-[70px] 
            z-[99] rounded-md text-zinc-900">
                <button onClick={handleRedirectProfilePage} className="w-full p-2 font-bold hover:bg-[#d4a53e] rounded-md">Perfil</button>
                <button onClick={handleLogoutCurrentSession} className="w-full p-2 font-bold hover:bg-[#d4a53e] rounded-md">Sair</button>
            </div>
        </nav>
    )
}

export default NavigationAdm;