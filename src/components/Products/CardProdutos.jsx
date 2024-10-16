import React, { useState } from "react";
import SureProductDelete from "./SureProductDelete";
import axios from "axios";
import { DeleteForever } from "@mui/icons-material";

function CardProdutos({ name, url_img, available, value, id, reload }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newQuantity, setNewQuantity] = useState(available);

    const handleDeleteCurrentProduct = () => {
        setShowDeleteModal(true);
        const currentWindow = document.querySelector(".windows-del-warning");
        if (currentWindow) {
            currentWindow.style.display = "flex";
        }
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
        <div className="w-[268px] h-[310px] bg-[#3C4557] 
        rounded-[10px] flex flex-col shadow-lg shadow-[#0808083e]
        justify-around items-center text-white relative">
            <span className="font-bold">R${value.toFixed(2)}</span>
            <img src={url_img} alt="foto de produto" className="w-[200px] h-[200px] object-cover rounded-md" />
            <span>{name}</span>
            {isEditing ? (
                <div className="flex items-center">
                    <input 
                        type="number" 
                        value={newQuantity}
                        onChange={(e) => setNewQuantity(e.target.value)}
                        className="w-16 text-black text-center mr-2"
                    />
                    <button 
                        onClick={handleSaveQuantity} 
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded text-sm"
                    >
                        Salvar
                    </button>
                </div>
            ) : (
                <div className="flex items-center">
                    <span className="text-[8pt] text-[#92F82C] mr-2">{available} disponíveis</span>
                    <button 
                        onClick={handleEditQuantity}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded text-sm"
                    >
                        Editar
                    </button>
                </div>
            )}

            <button 
                onClick={handleDeleteCurrentProduct} 
                className="absolute bottom-1 right-1 text-red-500 hover:text-red-600"
            >
                <DeleteForever />
            </button>

            {showDeleteModal && (
                <SureProductDelete
                    setIsLoading={setIsDeleting}
                    isLoading={isDeleting}
                    productId={id}
                    productName={name}
                    productUrl={url_img}
                    reload={reload}
                />
            )}
        </div>
    );
}

export default CardProdutos;
