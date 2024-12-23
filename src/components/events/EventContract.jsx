import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';

function EventContract() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEventData = async () => {
            try {
                const currentSession = JSON.parse(localStorage.getItem('arena-adm-login'));
                
                // Busca dados do evento
                const eventResponse = await axios.get(
                    `${import.meta.env.VITE_APP_API_URL}/events/find-event?event_id=${id}`,
                    {
                        headers: { 'Authorization': `Bearer ${currentSession.token}` }
                    }
                );

                console.log('Dados do evento:', eventResponse.data);

                // Busca dados do admin
                const adminResponse = await axios.get(
                    `${import.meta.env.VITE_APP_API_URL}/adm/admin-info-email?email=${currentSession.email}`,
                    {
                        headers: { 'Authorization': `Bearer ${currentSession.token}` }
                    }
                );

                console.log('Dados do admin:', adminResponse.data);

                if (eventResponse.data && eventResponse.data.event) {
                    setEvent(eventResponse.data.event);
                } else {
                    setError('Dados do evento não encontrados');
                }
                setAdmin(adminResponse.data);
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEventData();
    }, [id]);

    if (loading) {
        return <div className="p-8 text-center">Carregando contrato...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">Erro: {error}</div>;
    }

    if (!event || !admin) {
        return <div className="p-8 text-center">Dados não encontrados</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">CONTRATO DE PRESTAÇÃO DE SERVIÇOS</h1>
                <h2 className="text-xl">Evento: {event.event_type}</h2>
            </div>

            <div className="space-y-6 text-justify">
                <p>
                    Por este instrumento particular, de um lado <strong>{admin.name}</strong>, 
                    doravante denominado CONTRATADO, e de outro lado <strong>{event.responsible_name}</strong>, 
                    CPF: {event.cpf}, residente em {event.address}, doravante denominado CONTRATANTE, 
                    têm entre si justo e contratado o seguinte:
                </p>

                <h3 className="font-bold mt-4">1. OBJETO DO CONTRATO</h3>
                <p>
                    O presente contrato tem como objeto a prestação de serviços de entretenimento 
                    na modalidade {event.event_type}, a ser realizado no dia {dayjs(event.event_date).format('DD/MM/YYYY')} 
                    às {dayjs(event.event_date).format('HH:mm')} horas.
                </p>

                <h3 className="font-bold mt-4">2. VALOR E FORMA DE PAGAMENTO</h3>
                <p>
                    O valor total do evento será de R$ {Number(event.event_price || 0).toFixed(2)}
                    {event.is_overnight && event.overnight_price && 
                        `, com adicional de R$ ${Number(event.overnight_price).toFixed(2)} para serviço corujão`
                    }.
                </p>

                <h3 className="font-bold mt-4">3. LOCAL DO EVENTO</h3>
                <p>
                    O evento será realizado no estabelecimento {event.Local?.nome || 'Arena JAF'}.
                </p>

                <div className="mt-12 pt-8 border-t">
                    <p className="text-center mb-8">
                        {admin.address || 'Local'}, {dayjs().format('DD [de] MMMM [de] YYYY')}
                    </p>

                    <div className="flex justify-around mt-16">
                        <div className="text-center">
                            <div className="border-t border-black pt-2 w-64">
                                <p>CONTRATANTE</p>
                                <p>{event.responsible_name}</p>
                                <p>CPF: {event.cpf}</p>
                            </div>
                        </div>

                        <div className="text-center">
                            <div className="border-t border-black pt-2 w-64">
                                <p>CONTRATADO</p>
                                <p>{admin.name}</p>
                                <p>Arena JAF</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EventContract; 