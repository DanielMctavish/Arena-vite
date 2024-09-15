import React, { useState } from "react";
import { DeleteForever } from "@mui/icons-material";
import SureProductDelete from "./SureProductDelete"; // Import SureProductDelete

function CardProdutos({ name, url_img, available, value, id, reload }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false); // Add state for showing delete modal

    const handleDeleteCurrentProduct = () => {
        setShowDeleteModal(true); // Show delete modal
        const currentWindow = document.querySelector(".windows-del-warning");
        if (currentWindow) {
            currentWindow.style.display = "flex";
        }
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false); // Close delete modal
    };

    return (
        <div draggable className="w-[268px] h-[310px] bg-[#3C4557] 
        rounded-[10px] flex flex-col shadow-lg shadow-[#0808083e]
        justify-around items-center text-white relative">
            <span className="font-bold">R${value.toFixed(2)}</span>
            <img src={url_img} alt="foto de produto" className="w-[200px] h-[200px] object-cover rounded-md" />
            <span>{name}</span>
            <span className="text-[8pt] text-[#92F82C]">{available} disponíveis</span>

            <span className="absolute bottom-1 right-1">
                <button onClick={handleDeleteCurrentProduct} className="hover:text-red-600">
                    <DeleteForever />
                </button>
            </span>

            {showDeleteModal && (
                <SureProductDelete
                    setIsLoading={setIsDeleting}
                    isLoading={isDeleting}
                    productId={id}
                    productName={name} // Passar o nome do produto
                    productUrl={url_img}
                    reload={reload}
                />
            )}
        </div>
    );
}

export default CardProdutos;