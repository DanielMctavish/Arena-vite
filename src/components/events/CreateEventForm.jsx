import { useState, useEffect } from "react";
import axios from "axios";
import { 
    EventNote, 
    Person, 
    Badge, 
    LocationOn, 
    WhatsApp, 
    Store, 
    AttachMoney,
    NightsStay,
    Add
} from '@mui/icons-material';

function CreateEventForm({ onSuccess }) {
    const [locationList, setLocationList] = useState([]);
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

    useEffect(() => {
        getLocationList();
    }, []);

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
            setMessage({ type: 'error', text: 'Erro ao carregar locais' });
        }
    };

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
        const requiredFields = ['responsible_name', 'cpf', 'address', 'whatsapp', 'event_type', 'event_price', 'localId'];
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

    const handleCreateEvent = async () => {
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
            };

            // Adiciona campos do corujão se necessário
            if (formData.is_overnight) {
                eventData.is_overnight = true;
                eventData.overnight_price = formData.overnight_price;
                eventData.client_id = formData.client_id;
            }

            await axios.post(
                `${import.meta.env.VITE_APP_API_URL}/events/create-event`,
                eventData,
                {
                    headers: { 'Authorization': `Bearer ${currentSession.token}` }
                }
            );

            setMessage({ type: 'success', text: 'Evento criado com sucesso!' });
            
            // Limpa o formulário
            setFormData({
                responsible_name: '',
                cpf: '',
                address: '',
                whatsapp: '',
                event_type: '',
                event_price: '',
                localId: '',
                is_overnight: false,
                overnight_price: '',
                client_id: '',
            });

            // Chama o callback de sucesso se existir
            if (onSuccess) {
                setTimeout(onSuccess, 1500);
            }

        } catch (error) {
            console.error(error);
            setMessage({ 
                type: 'error', 
                text: error.response?.data?.message || 'Erro ao criar evento' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-xl">
            {message.text && (
                <div className={`mb-4 p-4 rounded-lg ${
                    message.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                }`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Local Selection */}
                <div className="flex flex-col gap-2">
                    <label className="text-white flex items-center gap-2">
                        <Store className="text-purple-400" />
                        Local do Evento
                    </label>
                    <select
                        name="localId"
                        value={formData.localId}
                        onChange={handleInputChange}
                        className="bg-gray-800 text-white rounded-lg p-3 border border-purple-500 focus:border-purple-400 focus:outline-none"
                    >
                        <option value="">Selecione um local</option>
                        {locationList.map((local) => (
                            <option key={local.id} value={local.id}>
                                {local.nome}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Responsável */}
                <div className="flex flex-col gap-2">
                    <label className="text-white flex items-center gap-2">
                        <Person className="text-purple-400" />
                        Responsável
                    </label>
                    <input
                        type="text"
                        name="responsible_name"
                        value={formData.responsible_name}
                        onChange={handleInputChange}
                        placeholder="Nome do responsável"
                        className="bg-gray-800 text-white rounded-lg p-3 border border-purple-500 focus:border-purple-400 focus:outline-none"
                    />
                </div>

                {/* CPF */}
                <div className="flex flex-col gap-2">
                    <label className="text-white flex items-center gap-2">
                        <Badge className="text-purple-400" />
                        CPF
                    </label>
                    <input
                        type="text"
                        name="cpf"
                        value={formData.cpf}
                        onChange={handleInputChange}
                        placeholder="CPF do responsável"
                        className="bg-gray-800 text-white rounded-lg p-3 border border-purple-500 focus:border-purple-400 focus:outline-none"
                    />
                </div>

                {/* Endereço */}
                <div className="flex flex-col gap-2">
                    <label className="text-white flex items-center gap-2">
                        <LocationOn className="text-purple-400" />
                        Endereço
                    </label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Endereço do responsável"
                        className="bg-gray-800 text-white rounded-lg p-3 border border-purple-500 focus:border-purple-400 focus:outline-none"
                    />
                </div>

                {/* WhatsApp */}
                <div className="flex flex-col gap-2">
                    <label className="text-white flex items-center gap-2">
                        <WhatsApp className="text-purple-400" />
                        WhatsApp
                    </label>
                    <input
                        type="text"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleInputChange}
                        placeholder="WhatsApp do responsável"
                        className="bg-gray-800 text-white rounded-lg p-3 border border-purple-500 focus:border-purple-400 focus:outline-none"
                    />
                </div>

                {/* Tipo de Evento */}
                <div className="flex flex-col gap-2">
                    <label className="text-white flex items-center gap-2">
                        <EventNote className="text-purple-400" />
                        Tipo de Evento
                    </label>
                    <select
                        name="event_type"
                        value={formData.event_type}
                        onChange={handleInputChange}
                        className="bg-gray-800 text-white rounded-lg p-3 border border-purple-500 focus:border-purple-400 focus:outline-none"
                    >
                        <option value="">Selecione o tipo</option>
                        <option value="VIP">VIP</option>
                        <option value="PREMIUM">PREMIUM</option>
                        <option value="PRO">PRO</option>
                        <option value="GOLD">GOLD</option>
                    </select>
                </div>

                {/* Preço */}
                <div className="flex flex-col gap-2">
                    <label className="text-white flex items-center gap-2">
                        <AttachMoney className="text-purple-400" />
                        Preço
                    </label>
                    <input
                        type="number"
                        name="event_price"
                        value={formData.event_price}
                        onChange={handleInputChange}
                        placeholder="Preço do evento"
                        className="bg-gray-800 text-white rounded-lg p-3 border border-purple-500 focus:border-purple-400 focus:outline-none"
                    />
                </div>

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

                {/* Opção Corujão */}
                <div className="md:col-span-2 border-t border-purple-500/30 pt-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="is_overnight"
                            checked={formData.is_overnight}
                            onChange={handleInputChange}
                            className="form-checkbox h-5 w-5 text-purple-500 rounded"
                        />
                        <NightsStay className="text-purple-400" />
                        <span className="text-white">Evento Corujão</span>
                    </label>
                </div>

                {/* Campos condicionais para Corujão */}
                {formData.is_overnight && (
                    <div className="md:col-span-2 bg-purple-900/30 rounded-lg p-6 space-y-6">
                        <h3 className="text-white text-lg font-bold flex items-center gap-2 mb-4">
                            <NightsStay className="text-purple-400" />
                            Configurações do Corujão
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Preço do Corujão */}
                            <div className="flex flex-col gap-2">
                                <label className="text-white flex items-center gap-2">
                                    <AttachMoney className="text-purple-400" />
                                    Preço Adicional do Corujão
                                </label>
                                <input
                                    type="number"
                                    name="overnight_price"
                                    value={formData.overnight_price}
                                    onChange={handleInputChange}
                                    placeholder="Valor adicional para o corujão"
                                    className="bg-gray-800 text-white rounded-lg p-3 border border-purple-500 focus:border-purple-400 focus:outline-none"
                                />
                            </div>

                            {/* ID do Cliente */}
                            <div className="flex flex-col gap-2">
                                <label className="text-white flex items-center gap-2">
                                    <Person className="text-purple-400" />
                                    ID do Cliente
                                </label>
                                <input
                                    type="text"
                                    name="client_id"
                                    value={formData.client_id}
                                    onChange={handleInputChange}
                                    placeholder="ID do cliente responsável"
                                    className="bg-gray-800 text-white rounded-lg p-3 border border-purple-500 focus:border-purple-400 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Botão Submit */}
                <div className="md:col-span-2 mt-6 flex justify-center">
                    <button
                        onClick={handleCreateEvent}
                        disabled={loading}
                        className={`
                            bg-purple-600 hover:bg-purple-700 text-white font-bold 
                            py-3 px-6 rounded-lg flex items-center gap-2 
                            transition duration-300 shadow-lg shadow-purple-500/20
                            ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                    >
                        {loading ? (
                            'Criando...'
                        ) : (
                            <>
                                <Add />
                                Criar Evento
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateEventForm; 