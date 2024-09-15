import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "./ArenaJafHome.css"
import bgcod from "../medias/backgrounds/codmw2.png"
import bgelden from "../medias/backgrounds/elden-ring-godfrey.png"
import logoStandard from "../medias/logos/Logo_Completa.png"
import logoGold from "../medias/logos/Logo_Completa_GOLD.png"

function ArenaJafHome() {
    const navigate = useNavigate();

    useEffect(() => {
        const admSession = JSON.parse(localStorage.getItem("arena-adm-login"));
        if (admSession) {
            navigate("/adm-machines");
        }
    }, [navigate]);

    return (
        <div className="w-full h-[100vh] overflow-hidden bg-[#24242433] flex justify-center items-center">

            <section className="home-arena-player w-[50%] h-[100vh] bg-[#007E42] overflow-hidden flex justify-center items-center">
                <img src={bgelden} alt="bg-player background game elden ring" id="img" />
                <h2 className="absolute font-bold text-white md:text-[22pt] top-[30vh]">PORTAL PLAYER</h2>
                <a href="/gamer-login" className="absolute md:w-[34vh] w-[20vh]" ><img src={logoStandard} alt="logo padrão" className="absolute md:w-[34vh] w-[20vh]" /></a>

            </section>

            <section className="home-arena-adm w-[50%] h-[100vh] bg-[#242424] overflow-hidden flex justify-center items-center">
                <img src={bgcod} alt="background game cod" id="img" />
                <h2 className="absolute font-bold text-white md:text-[22pt] top-[30vh]">PORTAL ADM</h2>
                <a href="/adm-login" className="absolute md:w-[34vh] w-[20vh]" ><img src={logoGold} alt="logo padrão ouro" className="absolute md:w-[34vh] w-[20vh]" /></a>

            </section>

        </div>
    )
}

export default ArenaJafHome;