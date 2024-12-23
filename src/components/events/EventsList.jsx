import { useState, useEffect } from "react";
import axios from "axios";
// import { useNavigate } from "react-router-dom";
import { Event, Delete, Edit, NightsStay, AccessTime, Description } from '@mui/icons-material';
import EditEventForm from './EditEventForm';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/pt-br';

// Configurando o dayjs
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('pt-br');

function EventsList() {
    const [events, setEvents] = useState([]);
    const [selectedLocal, setSelectedLocal] = useState('');
    const [locationList, setLocationList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [editingEvent, setEditingEvent] = useState(null);
    // const navigate = useNavigate();

    useEffect(() => {
        getLocationList();
    }, []);

    useEffect(() => {
        if (selectedLocal) {
            fetchEvents(selectedLocal);
        }
    }, [selectedLocal]);

    const getLocationList = async () => {
        try {
            const currentSession = JSON.parse(localStorage.getItem('arena-adm-login'));
            const response = await axios.get(
                `${import.meta.env.VITE_APP_API_URL}/adm/admin-info-email?email=${currentSession.email}`,
                {
                    headers: { 'Authorization': `Bearer ${currentSession.token}` }
                }
            );
            setLocationList(response.data.ArenaLocal || []);
        } catch (error) {
            console.error(error);
            setError('Erro ao carregar locais');
        }
    };

    const fetchEvents = async (localId) => {
        setLoading(true);
        setError('');
        try {
            const currentSession = JSON.parse(localStorage.getItem('arena-adm-login'));
            const response = await axios.get(
                `${import.meta.env.VITE_APP_API_URL}/events/list-events?local_id=${localId}`,
                {
                    headers: { 'Authorization': `Bearer ${currentSession.token}` }
                }
            );
            
            // Ordenar eventos
            const sortedEvents = Array.isArray(response.data.events) 
                ? response.data.events.sort((a, b) => {
                    // Primeiro, separar eventos passados e futuros
                    const dateA = dayjs(a.event_date);
                    const dateB = dayjs(b.event_date);
                    const now = dayjs();
                    const aIsPast = dateA.isBefore(now);
                    const bIsPast = dateB.isBefore(now);

                    // Se um é passado e outro é futuro, o futuro vem primeiro
                    if (aIsPast !== bIsPast) {
                        return aIsPast ? 1 : -1;
                    }

                    // Se ambos são futuros ou ambos são passados, ordenar por data
                    // Para eventos futuros: os mais próximos primeiro
                    // Para eventos passados: os mais recentes primeiro
                    return aIsPast 
                        ? dateB.valueOf() - dateA.valueOf() // Eventos passados: mais recentes primeiro
                        : dateA.valueOf() - dateB.valueOf(); // Eventos futuros: mais próximos primeiro
                })
                : [];

            setEvents(sortedEvents);
        } catch (error) {
            console.error(error);
            setError('Erro ao carregar eventos');
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEvent = async (eventId) => {
        if (window.confirm('Tem certeza que deseja excluir este evento?')) {
            try {
                const currentSession = JSON.parse(localStorage.getItem('arena-adm-login'));
                await axios.delete(
                    `${import.meta.env.VITE_APP_API_URL}/events/delete-event?event_id=${eventId}`,
                    {
                        headers: { 'Authorization': `Bearer ${currentSession.token}` }
                    }
                );
                fetchEvents(selectedLocal);
            } catch (error) {
                console.error(error);
                setError('Erro ao excluir evento');
            }
        }
    };

    const handleEditClick = (event) => {
        setEditingEvent(event);
    };

    const handleEditClose = () => {
        setEditingEvent(null);
    };

    const handleEditSuccess = () => {
        fetchEvents(selectedLocal);
        setEditingEvent(null);
    };

    const getEventStatus = (eventDate) => {
        if (!eventDate) return {
            status: 'error',
            color: 'bg-gray-500',
            progress: 0,
            text: '❌ Data inválida',
            shadow: 'rgba(75, 85, 99, 0.5)'
        };

        try {
            const date = dayjs(eventDate);
            if (!date.isValid()) throw new Error('Data inválida');

            const now = dayjs();
            const daysUntil = date.diff(now, 'day');
            
            if (date.isBefore(now)) {
                return {
                    status: 'past',
                    color: 'bg-gray-500',
                    progress: 100,
                    text: '✓ Evento finalizado',
                    shadow: 'rgba(75, 85, 99, 0.5)'
                };
            }

            if (daysUntil <= 1) {
                return {
                    status: 'imminent',
                    color: 'bg-red-500',
                    progress: 90,
                    text: '🔥 Evento próximo',
                    shadow: 'rgba(239, 68, 68, 0.5)'
                };
            }

            if (daysUntil <= 7) {
                return {
                    status: 'upcoming',
                    color: 'bg-yellow-500',
                    progress: 70,
                    text: '⚡ Esta semana',
                    shadow: 'rgba(245, 158, 11, 0.5)'
                };
            }

            if (daysUntil <= 30) {
                return {
                    status: 'scheduled',
                    color: 'bg-green-500',
                    progress: 40,
                    text: '📅 Este mês',
                    shadow: 'rgba(34, 197, 94, 0.5)'
                };
            }

            return {
                status: 'future',
                color: 'bg-blue-500',
                progress: 20,
                text: '🗓️ Agendado',
                shadow: 'rgba(59, 130, 246, 0.5)'
            };
        } catch (error) {
            console.error('Erro ao calcular status do evento:', error);
            return {
                status: 'error',
                color: 'bg-gray-500',
                progress: 0,
                text: '❌ Erro na data',
                shadow: 'rgba(75, 85, 99, 0.5)'
            };
        }
    };

    const formatEventDate = (date) => {
        if (!date) return 'Data não definida';
        
        try {
            const formattedDate = dayjs(date).format('DD/MM/YYYY HH:mm');
            return formattedDate !== 'Invalid Date' ? formattedDate : 'Data inválida';
        } catch (error) {
            console.error('Erro ao formatar data:', error);
            return 'Erro na data';
        }
    };

    const handleOpenContract = (event) => {
        // Abre uma nova janela com o contrato
        const contractWindow = window.open('/event-contract/' + event.id, '_blank', 'noopener,noreferrer');
        if (contractWindow) contractWindow.focus();
    };

    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-xl">
            <div className="mb-6">
                <select
                    value={selectedLocal}
                    onChange={(e) => setSelectedLocal(e.target.value)}
                    className="w-full bg-gray-800 text-white rounded-lg p-3 border border-purple-500"
                >
                    <option value="">Selecione um local</option>
                    {locationList.map((local) => (
                        <option key={local.id} value={local.id}>
                            {local.nome}
                        </option>
                    ))}
                </select>
            </div>

            {loading && (
                <div className="text-center text-white py-4">
                    Carregando eventos...
                </div>
            )}

            {error && (
                <div className="text-center text-red-400 py-4">
                    {error}
                </div>
            )}

            {!loading && !error && events.length === 0 && (
                <div className="text-center text-gray-400 py-4">
                    Nenhum evento encontrado para este local
                </div>
            )}

            <div className="grid gap-4">
                {Array.isArray(events) && events.map((event) => {
                    const eventStatus = getEventStatus(event.event_date);
                    const isPastEvent = eventStatus.status === 'past';

                    return (
                        <div 
                            key={event.id} 
                            className={`bg-gray-800/50 rounded-lg p-4 transition-all duration-300 ${
                                isPastEvent ? 'opacity-50' : 'hover:bg-gray-800/70'
                            }`}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex items-start gap-3">
                                    <Event className="text-purple-400 mt-1" />
                                    <div>
                                        <h3 className="text-white font-bold">{event.responsible_name}</h3>
                                        <div className="text-gray-300 text-sm space-y-1">
                                            <p>{event.event_type} - R$ {event.event_price}</p>
                                            <p>WhatsApp: {event.whatsapp}</p>
                                            <p>CPF: {event.cpf}</p>
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <AccessTime className="text-sm" />
                                                {formatEventDate(event.event_date)}
                                            </div>
                                        </div>
                                        {event.is_overnight && (
                                            <div className="mt-2">
                                                <span className="flex items-center gap-1 text-yellow-300 text-sm">
                                                    <NightsStay fontSize="small" /> Corujão - R$ {event.overnight_price}
                                                </span>
                                                {event.client && (
                                                    <span className="text-gray-400 text-xs">
                                                        Cliente: {event.client.name}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {!isPastEvent && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleOpenContract(event)}
                                            className="text-purple-400 hover:text-purple-300 transition-colors"
                                            title="Ver Contrato"
                                        >
                                            <Description />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteEvent(event.id)}
                                            className="text-red-400 hover:text-red-300 transition-colors"
                                            title="Excluir evento"
                                        >
                                            <Delete />
                                        </button>
                                        <button 
                                            onClick={() => handleEditClick(event)}
                                            className="text-blue-400 hover:text-blue-300 transition-colors"
                                            title="Editar evento"
                                        >
                                            <Edit />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Barra de progresso/termômetro */}
                            <div className="mt-4 bg-gray-800/50 p-4 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-sm font-medium ${eventStatus.color.replace('bg-', 'text-')}`}>
                                        {eventStatus.text}
                                    </span>
                                    <span className="text-sm text-gray-400">
                                        {event.event_date ? dayjs(event.event_date).isValid() ? 
                                            dayjs(event.event_date).fromNow() : 
                                            'Data inválida'
                                        : 'Data não definida'}
                                    </span>
                                </div>
                                <div className="relative w-full">
                                    <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                                        <div 
                                            className={`${eventStatus.color} h-full transition-all duration-500 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.3)]`}
                                            style={{ 
                                                width: `${eventStatus.progress}%`,
                                                boxShadow: `0 0 10px ${eventStatus.color.replace('bg-', '').replace('-500', '')}`
                                            }}
                                        />
                                    </div>
                                    {/* Marcadores de tempo */}
                                    <div className="absolute w-full flex justify-between -mt-1 px-1">
                                        <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                                        <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                                        <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                                        <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                                        <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                                    </div>
                                </div>
                                {/* Legenda adicional baseada no status */}
                                <div className="mt-2 text-xs text-gray-400 flex items-center gap-2">
                                    <AccessTime fontSize="small" />
                                    {eventStatus.status === 'past' ? (
                                        <span>Evento realizado em {formatEventDate(event.event_date)}</span>
                                    ) : (
                                        <span>Evento marcado para {formatEventDate(event.event_date)}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {editingEvent && (
                <EditEventForm
                    event={editingEvent}
                    onClose={handleEditClose}
                    onSuccess={handleEditSuccess}
                />
            )}
        </div>
    );
}

export default EventsList; 