import React from "react";
import { Link } from 'react-router-dom';
import bgelden from "../medias/backgrounds/elden-ring-godfrey.png";
import logoStandard from "../medias/logos/Logo_Completa.png";
import { Login, SportsEsports, AccessTime } from "@mui/icons-material";

function ArenaJafHome() {
    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white font-['Exo_2',sans-serif] overflow-hidden">
            <img src={bgelden} alt="background" className="absolute top-0 left-0 w-full h-full object-cover opacity-30 blur-[4px]" />
            
            <div className="relative z-10 container mx-auto px-4 py-12">
                <header className="flex justify-center items-center mb-12">
                    <img src={logoStandard} alt="Arena JAF Logo" className="w-64 md:w-80" />
                </header>

                <main>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center font-['Orbitron',sans-serif] text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">Bem-vindo à Arena JAF</h1>
                    <p className="text-xl md:text-2xl text-center mb-12 text-gray-300">Sua experiência de jogo elevada a outro nível!</p>

                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                        <FeatureCard 
                            icon={<Login className="text-5xl mb-4 text-purple-400" />}
                            title="Faça Login"
                            description="Acesse sua conta para ver todas as suas sessões de jogo e histórico."
                        />
                        <FeatureCard 
                            icon={<SportsEsports className="text-5xl mb-4 text-purple-400" />}
                            title="Produtos Disponíveis"
                            description="Explore nossa ampla gama de jogos e equipamentos de última geração."
                        />
                        <FeatureCard 
                            icon={<AccessTime className="text-5xl mb-4 text-purple-400" />}
                            title="Horas Disponíveis"
                            description="Verifique seu saldo de horas e planeje suas próximas sessões de jogo."
                        />
                    </div>

                    <div className="text-center">
                        <Link to="/gamer-login" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full text-lg transition duration-300 shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70">
                            Comece Agora!
                        </Link>
                    </div>
                </main>
            </div>
        </div>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 flex flex-col items-center text-center hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
            {icon}
            <h3 className="text-xl font-bold mb-2 font-['Orbitron',sans-serif] text-purple-400">{title}</h3>
            <p className="text-gray-300">{description}</p>
        </div>
    );
}

export default ArenaJafHome;
