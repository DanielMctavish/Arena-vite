import { ArrowBack, Close, Add, Remove } from "@mui/icons-material";
import { useRef } from "react";

function ModClientConsumoCheckout({ setIsShowingCheckout, itemsCard, setItemsCard }) {

    const removeItem = (product) => {
        const updatedItemsCard = itemsCard.map(item => {
            if (item.product.id === product.id) {
                return { ...item, quant: item.quant - 1 };
            }
            return item;
        }).filter(item => item.quant > 0);
        setItemsCard(updatedItemsCard);
    };

    const addItem = (product) => {
        const updatedItemsCard = itemsCard.map(item => {
            if (item.product.id === product.id) {
                return { ...item, quant: item.quant + 1 };
            }
            return item;
        });
        setItemsCard(updatedItemsCard);
    };

    const handleConfirm = () => { };

    const refCheckout = useRef();

    const handleCloseCurrentWindow = () => {
        const currentClientWindow = refCheckout.current;
        currentClientWindow.style.display = "none";
        setIsShowingCheckout(false);
    };

    const clearCart = () => {
        setItemsCard([]);
    };

    return (
        <div ref={refCheckout} className="w-[60%] h-[88%] flex flex-col p-1
        bg-gradient-to-t from-[#3C4557] to-[#192234] text-white rounded-md 
        justify-center items-center gap-1 relative
        shadow-lg shadow-[#0f0f0f4d] overflow-y-auto">

            <span onClick={handleCloseCurrentWindow} className="absolute top-1 left-1 text-zinc-100 cursor-pointer">
                <ArrowBack />
            </span>

            <section className="flex flex-col w-[99%] h-[70%] bg-[#0c101a] rounded-md p-1 gap-1 overflow-y-auto">
                {Array.isArray(itemsCard) && itemsCard.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-[#192234] 
                        hover:bg-[#202b42] w-full rounded-md cursor-pointer">
                        <img src={item.product.url_img} alt="produto" className="w-[100px] h-[100px] object-cover rounded-md" />
                        <span>{item.product.name}</span>
                        <div className="flex items-center gap-2">
                            <button onClick={() => removeItem(item.product)} className="text-white">
                                <Remove />
                            </button>
                            <span>{item.quant}</span>
                            <button onClick={() => addItem(item.product)} className="text-white">
                                <Add />
                            </button>
                        </div>
                        <span className="font-bold">R$ {(item.product.value * item.quant).toFixed(2)}</span>
                        <span onClick={() => removeItem(item.product)} className="text-zinc-100 cursor-pointer">
                            <Close />
                        </span>
                    </div>
                ))}
            </section>
            <section className="flex flex-col w-[99%] h-[16%] bg-[#0c101a] rounded-md p-1 gap-1 overflow-y-auto">
                <button onClick={handleConfirm} className="w-full h-[50%] bg-[#247e18] rounded-md">Confirmar venda</button>
                <button onClick={clearCart} className="w-full h-[50%] bg-[#c63129] rounded-md">Limpar carrinho</button>
            </section>
        </div>
    );
}

export default ModClientConsumoCheckout;
