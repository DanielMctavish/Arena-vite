import { useState } from "react";
import boxIcon from "../../../medias/icons/box-icon.png";
import numeral from "numeral"

function AddNewProduct() {
    const [productName, setProductName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [price, setPrice] = useState();

    const handleSetName = (e) => {
        setProductName(e.target.value);
    };

    const handleSetQuantity = (e) => {
        setQuantity(e.target.value);
    };


    const handleSetPrice = (e) => {

        
        setPrice(formattedValue);
    };

    return (
        <div className="w-[60%] h-[400px] flex bg-[#3C4557] text-white rounded-md justify-center items-center gap-3">

            <div className="flex flex-col gap-3 justify-start items-center">
                <img src={boxIcon} alt="icone caixa aberta" className="w-[70px] h-[70px] rounded-[4px] object-cover" />
                <input
                    type="text"
                    value={productName}
                    onChange={handleSetName}
                    className="bg-transparent border-white border-[1px] p-2 placeholder:text-white"
                    placeholder="Nome do produto"
                />
                <input
                    type="number"
                    value={quantity}
                    onChange={handleSetQuantity}
                    className="bg-transparent border-white border-[1px] p-2 placeholder:text-white"
                    placeholder="Quantidade"
                />
                <input
                    type="text"
                    value={price}
                    onChange={handleSetPrice}
                    className="bg-transparent border-white border-[1px] p-2 placeholder:text-white"
                    placeholder="R$ 0.00"
                />
            </div>

        </div>
    );
}

export default AddNewProduct;
