import { useState, useEffect } from "react";
import axios from "axios";
import { 
    EventNote, 
    Save,
    Close
} from '@mui/icons-material';
import dayjs from 'dayjs';

function EditEventForm({ event, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        responsible_name: '',
        cpf: '',
        address: '',
        whatsapp: '',
        event_type: '',
        event_price: '',
        event_date: '',
        localId: '',
        is_overnight: false,
        overnight_price: '',
        client_id: '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Carrega os dados do evento no formulário
    useEffect(() => {
        if (event) {
            // Formata a data para o formato do input datetime-local
            const formattedDate = dayjs(event.event_date).format('YYYY-MM-DDTHH:mm');
            
            setFormData({
                ...event,
                event_date: formattedDate
            });
        }
    }, [event]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : 
                    name === 'event_price' || name === 'overnight_price' ? 
                    parseFloat(value) || '' : value
        }));
    };

    const validateForm = () => {
        const requiredFields = ['responsible_name', 'cpf', 'address', 'whatsapp', 'event_type', 'event_price', 'localId', 'event_date'];
        const missingFields = requiredFields.filter(field => !formData[field]);
        
        if (missingFields.length > 0) {
            setMessage({ 
                type: 'error', 
                text: `Por favor, preencha todos os campos obrigatórios: ${missingFields.join(', ')}` 
            });
            return false;
        }
        return true;
    };

    const handleUpdateEvent = async () => {
        if (!validateForm()) return;

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const currentSession = JSON.parse(localStorage.getItem('arena-adm-login'));
            
            // Prepara os dados do evento
            const eventData = {
                responsible_name: formData.responsible_name,
                cpf: formData.cpf,
                address: formData.address,
                whatsapp: formData.whatsapp,
                event_type: formData.event_type,
                event_price: formData.event_price,
                localId: formData.localId,
                // Converte a data para o formato ISO
                event_date: dayjs(formData.event_date).toISOString()
            };

            // Adiciona campos do corujão se necessário
            if (formData.is_overnight) {
                eventData.is_overnight = true;
                eventData.overnight_price = formData.overnight_price;
                eventData.client_id = formData.client_id;
            }

            await axios.patch(
                `${import.meta.env.VITE_APP_API_URL}/events/update-event?event_id=${event.id}`,
                eventData,
                {
                    headers: { 'Authorization': `Bearer ${currentSession.token}` }
                }
            );

            setMessage({ type: 'success', text: 'Evento atualizado com sucesso!' });
            
            if (onSuccess) {
                setTimeout(() => {
                    onSuccess();
                    onClose();
                }, 1500);
            }

        } catch (error) {
            console.error(error);
            setMessage({ 
                type: 'error', 
                text: error.response?.data?.message || 'Erro ao atualizar evento' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <EventNote className="text-purple-400" />
                        Editar Evento
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <Close />
                    </button>
                </div>

                {message.text && (
                    <div className={`mb-4 p-4 rounded-lg ${
                        message.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                    }`}>
                        {message.text}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Campos do formulário */}
                    <div className="flex flex-col gap-2">
                        <label className="text-white">Nome do Responsável</label>
                        <input
                            type="text"
                            name="responsible_name"
                            value={formData.responsible_name}
                            onChange={handleInputChange}
                            className="bg-gray-800 text-white rounded-lg p-3 border border-purple-500 focus:border-purple-400 focus:outline-none"
                        />
                    </div>

                    {/* Adicione aqui os outros campos do formulário seguindo o mesmo padrão */}
                    {/* ... */}

                    {/* Data do Evento */}
                    <div className="flex flex-col gap-2">
                        <label className="text-white flex items-center gap-2">
                            <EventNote className="text-purple-400" />
                            Data do Evento
                        </label>
                        <input
                            type="datetime-local"
                            name="event_date"
                            value={formData.event_date}
                            onChange={handleInputChange}
                            className="bg-gray-800 text-white rounded-lg p-3 border border-purple-500 focus:border-purple-400 focus:outline-none"
                        />
                    </div>

                    {/* ... resto dos campos ... */}
                </div>

                {/* Botões de ação */}
                <div className="mt-6 flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleUpdateEvent}
                        disabled={loading}
                        className={`
                            bg-purple-600 hover:bg-purple-700 text-white font-bold 
                            py-2 px-4 rounded-lg flex items-center gap-2 
                            transition duration-300 shadow-lg shadow-purple-500/20
                            ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                    >
                        {loading ? (
                            'Atualizando...'
                        ) : (
                            <>
                                <Save />
                                Salvar Alterações
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditEventForm; 