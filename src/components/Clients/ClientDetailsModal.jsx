/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { Close, Email, Phone, LocationOn, CalendarToday, AddAPhoto, CheckCircle, Receipt, Gamepad, AccessTime, ShoppingCart, Payments, CreditCard, Pix } from '@mui/icons-material';
import dayjs from 'dayjs';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';


function ClientDetailsModal({ client, onClose, onClientUpdated }) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: async (acceptedFiles) => {
            if (!client) return;
            if (acceptedFiles.length > 1) {
                alert("Só é possível importar uma imagem por vez");
                return;
            }

            setIsUpdating(true);
            setUploadSuccess(false);
            const getAdmSession = JSON.parse(localStorage.getItem("arena-adm-login"));

            try {
                const formData = new FormData();
                formData.append('arena-client-profile', acceptedFiles[0]);

                const uploadResponse = await axios.post(
                    `${import.meta.env.VITE_APP_API_URL}/client/upload-client-profile`,
                    formData
                );

                const config = {
                    headers: {
                        'Authorization': `Bearer ${getAdmSession.token}`
                    }
                };

                await axios.patch(
                    `${import.meta.env.VITE_APP_API_URL}/client/update?client_id=${client.id}`,
                    {
                        avatar_url: uploadResponse.data.currentImage
                    },
                    config
                );

                setUploadSuccess(true);
                onClientUpdated?.();
                
                setTimeout(() => {
                    onClose();
                }, 1500);

            } catch (error) {
                console.error('Erro ao atualizar foto:', error);
                alert('Erro ao atualizar foto do cliente');
            } finally {
                setIsUpdating(false);
            }
        },
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif']
        },
        maxFiles: 1,
        noClick: false,
        noKeyboard: true
    });

    const formattedTime = (hours) => {
        if (!hours) return '0h';

        const totalMinutes = hours * 60;
        const hoursCount = Math.floor(totalMinutes / 60);
        const minutesCount = Math.round(totalMinutes % 60);

        if (hoursCount === 0) return `${minutesCount}min`;
        if (minutesCount === 0) return `${hoursCount}h`;
        return `${hoursCount}h ${minutesCount}min`;
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const getTransactionIcon = (type, method) => {
        if (type === 'MACHINE_CREDIT') return <AccessTime className="text-blue-400" />;
        if (type === 'PRODUCT') return <ShoppingCart className="text-green-400" />;
        
        // Ícones para métodos de pagamento
        switch(method) {
            case 'PIX':
                return <Pix className="text-green-400" />;
            case 'CREDITO':
                return <CreditCard className="text-blue-400" />;
            case 'DINHEIRO':
                return <Payments className="text-yellow-400" />;
            default:
                return <Receipt className="text-gray-400" />;
        }
    };

    if (!client) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center 
        justify-center z-50 p-4">
            <div className="bg-[#18212f] rounded-xl shadow-xl max-w-5xl w-full 
            max-h-[90vh] overflow-y-auto relative">
                {/* Header com Avatar */}
                <div className="relative h-48 bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 
                overflow-hidden flex items-center justify-center">
                    {/* Padrão de fundo */}
                    <div className="absolute inset-0 bg-[url('/pattern-bg.png')] opacity-5"></div>

                    {/* Círculos decorativos */}
                    <div className="absolute -left-12 -top-12 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl"></div>
                    <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl"></div>

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/90 hover:text-white 
                        transition-all p-2 hover:bg-white/10 rounded-full z-10"
                    >
                        <Close className="text-2xl" />
                    </button>

                    {/* Área da foto com dropzone */}
                    <div className="relative group" {...getRootProps()}>
                        <input {...getInputProps()} />
                        <div className="cursor-pointer">
                            <img 
                                src={client?.avatar_url} 
                                alt="" 
                                className={`w-32 h-32 rounded-full object-cover mx-auto 
                                ${isUpdating ? 'opacity-30' : ''} 
                                transition-opacity duration-200`}
                            />
                        </div>

                        {/* Loading Overlay */}
                        {isUpdating && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <div className="animate-spin rounded-full h-10 w-10 border-2 
                                border-white border-t-transparent"></div>
                                <span className="text-white text-sm mt-2">Enviando...</span>
                            </div>
                        )}

                        {/* Sucesso Overlay */}
                        {uploadSuccess && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center 
                            bg-green-500/20 rounded-full">
                                <CheckCircle className="text-green-400 text-3xl" />
                                <span className="text-white text-sm mt-1">Atualizado!</span>
                            </div>
                        )}

                        {/* Hover/Drag Overlay */}
                        {!isUpdating && !uploadSuccess && (
                            <div className={`absolute inset-0 bg-black/60 rounded-full
                            ${isDragActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                            transition-all duration-200 flex items-center justify-center`}>
                                <div className="flex flex-col items-center">
                                    <AddAPhoto className="text-white text-2xl mb-1" />
                                    <span className="text-white text-xs">
                                        {isDragActive ? 'Solte para enviar' : 'Alterar foto'}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Informações do Cliente */}
                <div className="pt-20 p-6">
                    <h2 className="text-3xl font-bold text-white mb-1 flex items-center gap-2">
                        {client.nome}
                        {client.isPlaying && (
                            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                                Online
                            </span>
                        )}
                    </h2>
                    <p className="text-gray-400 text-sm mb-6">CPF: {client.cpf}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-gray-300 p-3 
                            bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                <Email className="text-purple-400" />
                                <span className="text-sm">{client.email}</span>
                            </div>

                            {client.tel && (
                                <div className="flex items-center gap-3 text-gray-300 p-3 
                                bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                    <Phone className="text-purple-400" />
                                    <span className="text-sm">{client.tel}</span>
                                </div>
                            )}

                            {client.address && (
                                <div className="flex items-center gap-3 text-gray-300 p-3 
                                bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                    <LocationOn className="text-purple-400" />
                                    <span className="text-sm">{client.address}</span>
                                </div>
                            )}

                            <div className="flex items-center gap-3 text-gray-300 p-3 
                            bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                <CalendarToday className="text-purple-400" />
                                <span className="text-sm">
                                    Cliente desde {dayjs(client.created_at).format('DD/MM/YYYY')}
                                </span>
                            </div>
                        </div>

                        {/* Estatísticas */}
                        <div className="space-y-4">
                            <div className="bg-gradient-to-r from-purple-500/10 to-purple-500/20 p-4 rounded-lg">
                                <p className="text-purple-400 text-sm mb-1">Saldo Atual</p>
                                <p className="text-white text-2xl font-bold">
                                    R$ {client.saldo.toFixed(2)}
                                </p>
                            </div>
                            <div className="bg-gradient-to-r from-blue-500/10 to-blue-500/20 p-4 rounded-lg">
                                <p className="text-blue-400 text-sm mb-1">Tempo Disponível</p>
                                <p className="text-white text-2xl font-bold">
                                    {formattedTime(client.horas || 0)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Seção de Histórico */}
                <div className="p-6 border-t border-white/10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Histórico de Sessões */}
                        <div>
                            <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                                <Gamepad className="text-purple-400" />
                                Histórico de Sessões
                            </h3>
                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2
                            scrollbar-thin scrollbar-thumb-purple-500/20 scrollbar-track-transparent">
                                {client.Sessions?.map((session) => (
                                    <div key={session.id} 
                                    className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-white font-medium">
                                                    Máquina: {session.Machine?.nano_id}
                                                </p>
                                                <p className="text-sm text-gray-400">
                                                    Duração: {formattedTime(session.duration / 60)}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-400">
                                                    {dayjs(session.timer_started_at).format('DD/MM/YY HH:mm')}
                                                </p>
                                                <span className={`text-xs px-2 py-1 rounded-full 
                                                ${session.status === 'RUNNING' 
                                                    ? 'bg-green-500/20 text-green-400' 
                                                    : 'bg-yellow-500/20 text-yellow-400'}`}>
                                                    {session.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Histórico de Transações */}
                        <div>
                            <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                                <Receipt className="text-purple-400" />
                                Histórico de Transações
                            </h3>
                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2
                            scrollbar-thin scrollbar-thumb-purple-500/20 scrollbar-track-transparent">
                                {client.Transactions?.map((transaction) => (
                                    <div key={transaction.id} 
                                    className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                {getTransactionIcon(transaction.transaction_type, transaction.method)}
                                                <div>
                                                    <p className="text-white font-medium">
                                                        {transaction.transaction_type === 'MACHINE_CREDIT' 
                                                            ? 'Crédito de Horas'
                                                            : transaction.transaction_type === 'PRODUCT'
                                                                ? 'Compra de Produto'
                                                                : transaction.transaction_type}
                                                    </p>
                                                    <p className="text-sm text-gray-400">
                                                        {transaction.method}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={`font-medium ${
                                                    transaction.fluxo === 'IN' 
                                                        ? 'text-green-400' 
                                                        : 'text-red-400'}`}>
                                                    {transaction.fluxo === 'IN' ? '+' : '-'}
                                                    {formatCurrency(transaction.value)}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    {dayjs(transaction.created_at).format('DD/MM/YY HH:mm')}
                                                </p>
                                            </div>
                                        </div>
                                        {transaction.product_description && (
                                            <p className="text-sm text-gray-400 mt-2 border-t border-white/5 pt-2">
                                                {transaction.product_description}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ClientDetailsModal; 