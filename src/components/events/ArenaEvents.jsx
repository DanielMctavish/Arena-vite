import { useState } from "react";
import CreateEventForm from "./CreateEventForm";
import EventsList from "./EventsList";
import { Add, List } from '@mui/icons-material';
import Asside from "../Asside/Asside";
import NavigationAdm from "../navigation/Navigation";
import { useSelector } from "react-redux";

function ArenaEvents() {
    const [activeView, setActiveView] = useState('list'); // 'list' ou 'create'
    const stateAdmin = useSelector(state => state.admin)

    return (
        <div className="bg-zinc-800 w-full h-[100vh] 
        flex justify-center items-center border-[10px] 
        border-[#e6a429] relative overflow-hidden">
            <nav className="w-[30%] h-[100vh] relative bg-red-400">
                <Asside />
            </nav>
            <section className="w-[70%] h-[100vh] relative p-3 flex flex-col justify-start items-center">
                <NavigationAdm title="Eventos" adm_id={stateAdmin.admin_id} />
                <div className="w-full h-[80vh] overflow-y-auto relative mt-[12vh]">
                    {/* Header com botão de alternância */}
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                            {activeView === 'list' ? 'Lista de Eventos' : 'Criar Novo Evento'}
                        </h1>
                        <button
                            onClick={() => setActiveView(activeView === 'list' ? 'create' : 'list')}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 
                            px-4 rounded-lg flex items-center gap-2 transition duration-300 fixed right-[4vh] z-[99]"
                        >
                            {activeView === 'list' ? (
                                <>
                                    <Add /> Criar Evento
                                </>
                            ) : (
                                <>
                                    <List /> Ver Eventos
                                </>
                            )}
                        </button>
                    </div>

                    {/* Renderização condicional dos componentes */}
                    <div className="transition-all duration-300">
                        {activeView === 'list' ? <EventsList /> : <CreateEventForm onSuccess={() => setActiveView('list')} />}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default ArenaEvents;