/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios"
import { ArrowBack, Close, Add, Remove } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function ModClientConsumoCheckout({ setIsShowingCheckout, itemsCard, setItemsCard }) {
    const [currentClient, setCurrentClient] = useState({})
    const clientState = useSelector(state => state.client)
    const navigate = useNavigate()

    useEffect(() => { setCurrentClient(clientState) }, clientState)

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

    // product_id: string
    // client_id: string
    // quantity: number
    // value: number

    const handleConfirm = async () => {
        const localSession = JSON.parse(localStorage.getItem('arena-adm-login'))
        console.log("items do carrinho... ", itemsCard[0])

        if (itemsCard.length > 0) {

            itemsCard.forEach(async item => {

                try {

                    await axios.post(`${import.meta.env.VITE_APP_API_URL}/product/buy-product`, {
                        product_id: item.product.id,
                        client_id: currentClient.client_id,
                        quantity: item.quant,
                        value: item.product.value * item.quant
                    }, {
                        headers: {
                            'Authorization': `Bearer ${localSession.token}`
                        }
                    }).then(response => {
                        console.log("resposta, compra -> ", response.data)
                    })

                } catch (error) {
                    console.log("error -> ", error.message)
                }

            })

            navigate("/adm-clientes")
            handleCloseCurrentWindow()
            clearCart()

        }

    };

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
            <span>{currentClient.nome}</span>

            <section className="flex flex-col w-[99%] h-[70%] bg-[#0c101a] rounded-md p-1 gap-1 overflow-y-auto">
                {Array.isArray(itemsCard) && itemsCard.map((item, index) => (
                    <div key={index} className="flex justify-start items-center p-2 bg-[#192234] gap-[4vh] 
                        hover:bg-[#202b42] w-full rounded-md cursor-pointer">
                        <img src={item.product.url_img} alt="produto" className="w-[100px] h-[100px] object-cover rounded-md" />

                        <section className="flex min-w-[20%] justify-between items-center">
                            <span className="font-bold text-[#139fd2]">{item.product.available - item.quant}</span>

                            <div className="flex items-center gap-2">
                                <button onClick={() => removeItem(item.product)} className="text-white">
                                    <Remove />
                                </button>

                                <span>{item.quant}</span>

                                <button onClick={() => addItem(item.product)} className="text-white">
                                    <Add />
                                </button>
                            </div>
                        </section>

                        <section className="flex w-[60%] justify-between items-center">
                            <span>{item.product.name}</span>

                            <span className="font-bold">R$ {(item.product.value * item.quant).toFixed(2)}</span>
                            <span onClick={() => removeItem(item.product)} className="text-zinc-100 cursor-pointer">
                                <Close />
                            </span>
                        </section>

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
