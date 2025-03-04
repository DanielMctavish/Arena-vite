import { useState } from 'react';
import { Close, Save, Person, Email, Phone, LocationOn } from '@mui/icons-material';
import axios from 'axios';

function ClientEdit({ client, onClose, onUpdate }) {
    const [formData, setFormData] = useState({
        nome: client.nome || '',
        email: client.email || '',
        tel: client.tel || '',
        address: client.address || '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const currentSession = JSON.parse(localStorage.getItem('arena-adm-login'));
            
            await axios.patch(
                `${import.meta.env.VITE_APP_API_URL}/client/update?client_id=${client.id}`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${currentSession.token}`
                    }
                }
            );

            onUpdate?.();
            onClose();
        } catch (error) {
            console.error('Erro ao atualizar cliente:', error);
            setError('Erro ao atualizar informações. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]">
            <div className="w-[500px] bg-gradient-to-br from-[#1c2833] to-[#2c3e50] 
            rounded-xl shadow-2xl border border-white/10 text-white p-6 relative animate-fadeIn">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Editar Cliente</h2>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <Close />
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm text-gray-400">Nome</label>
                        <div className="relative">
                            <input
                                type="text"
                                name="nome"
                                value={formData.nome}
                                onChange={handleChange}
                                className="w-full bg-[#131a29] text-white px-4 py-3 rounded-lg
                                border border-white/10 focus:border-purple-500 transition-colors
                                outline-none pl-12"
                                required
                            />
                            <Person className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm text-gray-400">Email</label>
                        <div className="relative">
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-[#131a29] text-white px-4 py-3 rounded-lg
                                border border-white/10 focus:border-purple-500 transition-colors
                                outline-none pl-12"
                                required
                            />
                            <Email className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm text-gray-400">Telefone</label>
                        <div className="relative">
                            <input
                                type="tel"
                                name="tel"
                                value={formData.tel}
                                onChange={handleChange}
                                className="w-full bg-[#131a29] text-white px-4 py-3 rounded-lg
                                border border-white/10 focus:border-purple-500 transition-colors
                                outline-none pl-12"
                            />
                            <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm text-gray-400">Endereço</label>
                        <div className="relative">
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full bg-[#131a29] text-white px-4 py-3 rounded-lg
                                border border-white/10 focus:border-purple-500 transition-colors
                                outline-none pl-12"
                            />
                            <LocationOn className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 rounded-lg bg-gray-600/30 text-white
                            hover:bg-gray-600/50 transition-colors"
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-3 rounded-lg bg-purple-600 text-white
                            hover:bg-purple-700 transition-colors disabled:opacity-50
                            disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <Save />
                            {isSubmitting ? "Salvando..." : "Salvar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ClientEdit; 