import React from 'react';
import { Close, Person, Email, Phone, LocationOn, CalendarToday } from '@mui/icons-material';
import dayjs from 'dayjs';

function ClientDetailsModal({ client, onClose }) {
    if (!client) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#18212f] w-[400px] rounded-lg shadow-xl border border-purple-500/20 
            overflow-hidden transform transition-all">
                {/* Header com Avatar */}
                <div className="relative h-32 bg-gradient-to-r from-purple-600 to-blue-600">
                    <button 
                        onClick={onClose}
                        className="absolute top-2 right-2 text-white/80 hover:text-white 
                        transition-colors p-1 hover:bg-white/10 rounded-full"
                    >
                        <Close />
                    </button>
                    <div className="absolute -bottom-12 left-4">
                        <img 
                            src={client.avatar_url} 
                            alt={client.nome} 
                            className="w-24 h-24 rounded-full border-4 border-[#18212f] object-cover"
                        />
                    </div>
                </div>

                {/* Informações do Cliente */}
                <div className="pt-14 p-4">
                    <h2 className="text-2xl font-bold text-white mb-1">{client.nome}</h2>
                    <p className="text-gray-400 text-sm mb-4">CPF: {client.cpf}</p>

                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-gray-300">
                            <Email className="text-purple-400" />
                            <span>{client.email}</span>
                        </div>

                        {client.tel && (
                            <div className="flex items-center gap-3 text-gray-300">
                                <Phone className="text-purple-400" />
                                <span>{client.tel}</span>
                            </div>
                        )}

                        {client.address && (
                            <div className="flex items-center gap-3 text-gray-300">
                                <LocationOn className="text-purple-400" />
                                <span>{client.address}</span>
                            </div>
                        )}

                        <div className="flex items-center gap-3 text-gray-300">
                            <CalendarToday className="text-purple-400" />
                            <span>Cliente desde {dayjs(client.created_at).format('DD/MM/YYYY')}</span>
                        </div>
                    </div>

                    {/* Estatísticas */}
                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <div className="bg-purple-500/10 p-3 rounded-lg">
                            <p className="text-purple-400 text-sm">Saldo</p>
                            <p className="text-white font-bold">R$ {client.saldo.toFixed(2)}</p>
                        </div>
                        <div className="bg-purple-500/10 p-3 rounded-lg">
                            <p className="text-purple-400 text-sm">Horas</p>
                            <p className="text-white font-bold">{client.horas || 0}h</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ClientDetailsModal; 