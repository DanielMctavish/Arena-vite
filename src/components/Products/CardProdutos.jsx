import React, { useState } from "react";
import SureProductDelete from "./SureProductDelete";
import axios from "axios";
import { DeleteForever, Edit, Check, Close } from "@mui/icons-material";

function CardProdutos({ name, url_img, available, value, id, reload }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newQuantity, setNewQuantity] = useState(available);

    const handleDeleteCurrentProduct = () => {
        setShowDeleteModal(true);
    };

    const handleEditQuantity = () => {
        setIsEditing(true);
    };

    const handleSaveQuantity = async () => {
        try {
            const getAdmSession = JSON.parse(localStorage.getItem("arena-adm-login"));
            const config = {
                headers: {
                    'Authorization': `Bearer ${getAdmSession.token}`
                }
            };

            await axios.patch(`${import.meta.env.VITE_APP_API_URL}/product/update-product?product_id=${id}`, 
                { available: parseInt(newQuantity) },
                config
            );

            setIsEditing(false);
            reload();
        } catch (error) {
            console.error("Erro ao atualizar quantidade:", error);
        }
    };

    return (
        <>
            <div className="w-[268px] bg-[#18212f] backdrop-blur-lg rounded-lg overflow-hidden 
            shadow-lg hover:shadow-purple-500/10 transition-all duration-300 
            hover:transform hover:-translate-y-1 group">
                {/* Cabeçalho com Preço */}
                <div className="p-4 flex justify-between items-center border-b border-purple-500/20">
                    <span className="text-2xl font-bold text-white">
                        R$ {value.toFixed(2)}
                    </span>
                    <div className="flex gap-2">
                        <button 
                            onClick={handleDeleteCurrentProduct} 
                            className="text-red-400 hover:text-red-300 transition-colors p-1 
                            rounded-full hover:bg-red-500/10"
                        >
                            <DeleteForever />
                        </button>
                    </div>
                </div>

                {/* Imagem do Produto */}
                <div className="relative group-hover:transform group-hover:scale-105 transition-transform duration-300">
                    <img 
                        src={url_img} 
                        alt={name} 
                        className="w-full h-[200px] object-cover" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 
                    group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Informações do Produto */}
                <div className="p-4 space-y-3">
                    <h3 className="text-white font-semibold text-lg">{name}</h3>
                    
                    <div className="flex items-center justify-between">
                        {isEditing ? (
                            <div className="flex items-center gap-2">
                                <input 
                                    type="number" 
                                    value={newQuantity}
                                    onChange={(e) => setNewQuantity(e.target.value)}
                                    className="w-16 bg-gray-700 text-white text-center rounded-lg p-1 
                                    border border-purple-500 focus:outline-none focus:border-purple-400"
                                />
                                <button 
                                    onClick={handleSaveQuantity}
                                    className="text-green-400 hover:text-green-300 transition-colors"
                                    title="Salvar"
                                >
                                    <Check />
                                </button>
                                <button 
                                    onClick={() => setIsEditing(false)}
                                    className="text-red-400 hover:text-red-300 transition-colors"
                                    title="Cancelar"
                                >
                                    <Close />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <span className={`text-sm ${available > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {available} disponíveis
                                </span>
                                <button 
                                    onClick={handleEditQuantity}
                                    className="text-blue-400 hover:text-blue-300 transition-colors"
                                    title="Editar quantidade"
                                >
                                    <Edit fontSize="small" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal de Confirmação */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center 
                justify-center z-50">
                    <SureProductDelete
                        setIsLoading={setIsDeleting}
                        isLoading={isDeleting}
                        productId={id}
                        productName={name}
                        productUrl={url_img}
                        reload={reload}
                        onClose={() => setShowDeleteModal(false)}
                    />
                </div>
            )}
        </>
    );
}

export default CardProdutos;
